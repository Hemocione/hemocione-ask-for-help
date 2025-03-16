import z from "zod";
import { getRequestById } from "~/server/services/requestService";

const RequestIdSchema = z.object({
  id: z.string().transform((str) => Number(str)),
});

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, RequestIdSchema.parse);

  const request = await getRequestById(id);

  if (!request) {
    throw createError({ statusCode: 404, statusMessage: "Request not found" });
  }

  return request;
});