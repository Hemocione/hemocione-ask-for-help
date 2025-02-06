import z from "zod";
import { paginateListRequest } from "~/server/services/requestService";
import {
  bloodTypeToDbType,
  BloodTypeValues,
} from "~/utils/bloodTypeTransformation";

const ListRequestSchema = z.object({
  page: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  per_page: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  name: z.string().optional(),
  bloodTypes: z
    .array(
      z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .transform((e) => bloodTypeToDbType(e))
    )
    .optional(),
});

export type Request = z.infer<typeof ListRequestSchema>;

export default defineEventHandler(async (event) => {
  const { page, per_page, bloodTypes, name } = await getValidatedQuery(
    event,
    ListRequestSchema.parse
  );

  const query: {
    name?: string;
    bloodTypes?: BloodTypeValues[];
  } = {};

  if (name) {
    query.name = name;
  }

  if (bloodTypes) {
    query.bloodTypes = bloodTypes.filter((e) => e !== undefined);
  }

  return await paginateListRequest({
    page,
    per_page,
    query,
  });
});
