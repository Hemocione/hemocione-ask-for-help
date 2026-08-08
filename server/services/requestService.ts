import type { Request, Assisted, RequestStatus } from "@prisma/client";
import { dbClient } from "~/prisma";
import { Request as RequestType } from "~/server/api/request/index.post";
import {
  BloodTypeKeys,
  BloodTypeValues,
  dbTypeToBloodType,
} from "~/utils/bloodTypeTransformation";

type CreateRequest = {
  local_name: string;
  address: string;
  city?: string;
  state?: string;
  cpf: string;
  name: string;
  local_latitude?: number;
  local_longitude?: number;
  blood_type: RequestType["blood_type"];
  photo_url?: string;
};

type QueryRequest = {
  name?: string;
  bloodTypes?: BloodTypeValues[];
  last?: Date;
  active?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
};

type PaginateRequest = {
  page?: number;
  per_page?: number;
  query?: QueryRequest;
};

export type RequestWithAssisted = Request & {
  assisted: {
    cpf: string;
    name: string;
    blood_type: BloodTypeKeys;
    photo_url: string | null;
    id: number;
    created_at: Date;
    updated_at: Date;
  };
};

// Liga/desliga via env var — desligar volta a exigir revisão manual antes de
// um pedido aparecer na lista pública.
export function isAutoApproveEnabled(): boolean {
  return process.env.AUTO_APPROVE_REQUESTS !== "0";
}

// Quantos dias um pedido fica visível publicamente antes de expirar.
export function getRequestExpirationDays(): number {
  const raw = process.env.REQUEST_EXPIRATION_DAYS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : 30;
}

// Pedidos criados antes desse campo existir têm expires_at null — tratamos
// como "nunca expira" em vez de backfillar uma data arbitrária no histórico.
function notExpiredFilter(): Record<string, unknown> {
  return { OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }] };
}

export async function createRequest(
  request: CreateRequest,
  requester_id: string,
): Promise<Request> {
  let assisted = await dbClient.assisted.findFirst({
    where: {
      cpf: request.cpf,
    },
  });

  if (assisted) {
    const activeRequest = await dbClient.request.findFirst({
      where: {
        assisted_id: assisted.id,
        active_campagin: true,
      },
    });

    if (activeRequest) {
      throw createError({
        message: "Assisted already has an active request",
        status: 409,
      });
    }
  }

  assisted = assisted
    ? await dbClient.assisted.update({
        where: { id: assisted.id },
        data: {
          name: request.name,
          blood_type: request.blood_type!,
          photo_url: request.photo_url,
        },
      })
    : await dbClient.assisted.create({
        data: {
          cpf: request.cpf,
          name: request.name,
          blood_type: request.blood_type!,
          photo_url: request.photo_url,
        },
      });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + getRequestExpirationDays());

  return dbClient.request.create({
    data: {
      local_name: request.local_name,
      address: request.address,
      city: request.city,
      state: request.state,
      local_latitude: request.local_latitude,
      local_longitude: request.local_longitude,
      requester_id,
      assisted_id: assisted.id,
      active_campagin: true,
      review_status: isAutoApproveEnabled() ? "Approved" : "Pending",
      expires_at: expiresAt,
    },
  });
}

export async function reviewRequest(
  requestId: number,
  data: {
    review_status?: Request["review_status"];
    active_campagin?: boolean;
  },
) {
  return dbClient.request.update({
    where: {
      id: requestId,
    },
    data: {
      review_status: data.review_status,
      active_campagin:
        data.active_campagin !== undefined
          ? data.active_campagin
          : // A campanha reprovada não deve seguir bloqueando novos pedidos
            // para o mesmo CPF (createRequest só barra duplicidade quando
            // active_campagin é true).
            data.review_status === "Declined"
            ? false
            : undefined,
    },
  });
}

function hydrateRequest(request: Request & { assisted: Assisted }) {
  return {
    ...request,
    assisted: {
      ...request.assisted,
      blood_type: dbTypeToBloodType(request.assisted.blood_type)!,
    },
  };
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function boundingBox(
  lat: number,
  lng: number,
  radiusKm: number,
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

export type RequestWithDistance = RequestWithAssisted & { distanceKm: number };

export async function paginateListRequest({
  page = 1,
  per_page = 10,
  query = {},
}: PaginateRequest): Promise<RequestWithAssisted[]> {
  const hasLocation =
    query.latitude !== undefined && query.longitude !== undefined;

  const where: Record<string, unknown> = {
    active_campagin: true,
    review_status: "Approved",
    ...notExpiredFilter(),
    created_at: query.last ? { gte: query.last } : undefined,
    assisted: {
      name: {
        contains: query.name,
        mode: "insensitive" as const,
      },
      blood_type: {
        in: query.bloodTypes,
      },
    },
  };

  if (!hasLocation) {
    const dbRequests = await dbClient.request.findMany({
      where,
      take: per_page,
      skip: (page - 1) * per_page,
      include: {
        assisted: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return dbRequests.map(hydrateRequest);
  }

  const radiusKm = query.radiusKm ?? 10;
  const box = boundingBox(query.latitude!, query.longitude!, radiusKm);
  where.local_latitude = { gte: box.minLat, lte: box.maxLat };
  where.local_longitude = { gte: box.minLng, lte: box.maxLng };

  const dbRequests = await dbClient.request.findMany({
    where,
    include: {
      assisted: true,
    },
  });

  const withDistance = dbRequests
    .map(hydrateRequest)
    .map((r) => {
      if (r.local_latitude == null || r.local_longitude == null) return null;
      const distance = haversineDistance(
        query.latitude!,
        query.longitude!,
        r.local_latitude,
        r.local_longitude,
      );
      if (distance > radiusKm) return null;
      return { ...r, distanceKm: distance };
    })
    .filter((r): r is RequestWithDistance => r !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const offset = (page - 1) * per_page;
  return withDistance.slice(offset, offset + per_page);
}

export async function paginateListRequestOndeDoar({
  page = 1,
  per_page = 10,
  query = {},
}: PaginateRequest): Promise<RequestWithAssisted[]> {
  const requests = await dbClient.request.findMany({
    where: {
      active_campagin: query.active,
      review_status: "Approved",
      updated_at: query.last ? { gte: query.last } : undefined,
    },
    take: per_page,
    skip: (page - 1) * per_page,
    include: {
      assisted: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return requests.map(hydrateRequest);
}

export const getRequestById = async (id: number) => {
  const request = await dbClient.request.findUnique({
    where: { id },
    include: {
      assisted: true,
    },
  });

  const isExpired = request?.expires_at != null && request.expires_at <= new Date();

  if (!request || request.review_status !== "Approved" || !request.active_campagin || isExpired) {
    return null;
  }

  return hydrateRequest(request);
};

export async function getAllPendingRequests(): Promise<RequestWithAssisted[]> {
  const pendingStatus = "Pending" as RequestStatus;

  const requests = await dbClient.request.findMany({
    where: {
      active_campagin: true,
      review_status: pendingStatus,
    },
    include: {
      assisted: true,
    },
  });

  return requests.map(hydrateRequest);
}
