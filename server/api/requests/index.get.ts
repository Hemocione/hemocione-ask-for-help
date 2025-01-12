import { paginateListRequest } from "~/server/services/requestService";
import z from "zod";

const ListRequestSchema = z.object({
  page: z.number().optional(),
  per_page: z.number().optional(),
});

export type Request = z.infer<typeof ListRequestSchema>;

export default defineEventHandler(async (event) => {
  const { page, per_page } = await getValidatedRouterParams(
    event,
    ListRequestSchema.parse
  );

  return await paginateListRequest({
    page,
    per_page,
  });
});
