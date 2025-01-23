import z from "zod";
import { paginateListRequest } from "~/server/services/requestService";
import { bloodTypeToDbType } from "~/utils/bloodTypeTransformation";

const ListRequestSchema = z.object({
  page: z.string().transform(str => Number(str)).optional(),
  per_page: z.string().transform(str => Number(str)).optional(),
  name: z.string().optional(),
  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .transform((e) => bloodTypeToDbType(e))
    .optional(),
});

export type Request = z.infer<typeof ListRequestSchema>;

export default defineEventHandler(async (event) => {
  const { page, per_page, bloodType, name } = await getValidatedQuery(
    event,
    ListRequestSchema.parse
  );

  const query = {
    ...(name && { name }),
    ...(bloodType && { bloodType }),
  }

  return await paginateListRequest({
    page,
    per_page,
    query
  });
});
