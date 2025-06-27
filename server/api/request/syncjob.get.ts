import z from "zod";
import { paginateListRequest } from "~/server/services/requestService";
import { bloodTypes } from "~/types/blood";
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
    .preprocess((val) => (typeof val === "string" ? [val] : val), 
      z.array(
        z
          .enum(bloodTypes)
          .transform(bloodTypeToDbType)
      )
    )
    .optional(),
  last: z
    .string()
    .transform((str) => new Date(str))
    .refine((date)=> !isNaN(date.getTime()), {
	message: "Invalid date",
	})
    .optional(),

});

export type Request = z.infer<typeof ListRequestSchema>;

export default defineEventHandler(async (event) => {
  const { page, per_page, bloodTypes, name, last } = await getValidatedQuery(
    event,
    ListRequestSchema.parse
  );

  const query: {
    name?: string;
    bloodTypes?: BloodTypeValues[];
    last?:Date; 
  } = {};

  if (name) {
    query.name = name;
  }

  if (bloodTypes) {
    query.bloodTypes = bloodTypes.filter((e) => e !== undefined);
  }

  if (last){
    query.last = last;
  }

  return await paginateListRequest({
    page,
    per_page,
    query,
  });
});
