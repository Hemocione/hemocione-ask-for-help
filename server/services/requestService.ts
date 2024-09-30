import { type Request } from "@prisma/client";
import { dbClient } from "~/server/db";
import { Request as RequestType } from "~/server/api/request/index.post";

type CreateRequest = {
  local_name: string;
  cpf: string;
  name: string;
  blood_type: RequestType["blood_type"];
  photo_url?: string;
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
      blood_type: request.blood_type,
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
