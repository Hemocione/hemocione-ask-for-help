import type { Request, Assisted } from "@prisma/client";
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
  requester_id: number
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

export async function paginateListRequest({
  page = 1,
  per_page = 10,
  query = {},
}: PaginateRequest): Promise<RequestWithAssisted[]> {
  const requests = await dbClient.request.findMany({
    where: {
      assisted: {
        name: {
          contains: query.name,
          mode: "insensitive",
        },
        blood_type: {
          in: query.bloodTypes,
        }
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

  const hydratedRequests = requests.map((request) => {
    return {
      ...request,
      assisted: {
        ...request.assisted,
        blood_type: dbTypeToBloodType(request.assisted.blood_type)!,
      },
    };
  });

  return hydratedRequests;
}
