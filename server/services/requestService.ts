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
  cpf: string;
  name: string;
  blood_type: RequestType["blood_type"];
  photo_url?: string;
};

type QueryRequest = {
  name?: string;
  bloodTypes?: BloodTypeValues[];
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

export async function createRequest(
  request: CreateRequest,
  requester_id: string
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
        status: 400,
      });
    }
  }

  assisted = await dbClient.assisted.create({
    data: {
      cpf: request.cpf,
      name: request.name,
      blood_type: request.blood_type!,
      photo_url: request.photo_url,
    },
  });

  return dbClient.request.create({
    data: {
      local_name: request.local_name,
      requester_id,
      assisted_id: assisted.id,
      active_campagin: true,
    },
  });
}

export async function reviewRequest(
  requestId: number,
  data: { review_status: Request["review_status"] }
) {
  return dbClient.request.update({
    where: {
      id: requestId,
    },
    data: {
      review_status: data.review_status,
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

export async function paginateListRequest({
  page = 1,
  per_page = 10,
  query = {},
}: PaginateRequest): Promise<RequestWithAssisted[]> {
  const requests = await dbClient.request.findMany({
    where: {
      active_campagin: true,
      review_status: "Approved",
      assisted: {
        name: {
          contains: query.name,
          mode: "insensitive",
        },
        blood_type: {
          in: query.bloodTypes,
        },
      },
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

  if (!request) return null;

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
