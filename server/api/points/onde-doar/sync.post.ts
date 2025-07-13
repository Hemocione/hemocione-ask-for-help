import z from "zod";
import { paginateListRequestOndeDoar } from "~/server/services/requestService";

const ListRequestSchema = z.object({
  page: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  per_page: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  last: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date",
    })
    .optional(),
  active: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
});

export type Request = z.infer<typeof ListRequestSchema>;

export default defineEventHandler(async (event) => {
  const { page, per_page, last, active } =
    await readValidatedBody(event, ListRequestSchema.parse);

  const query = {
    last,
    active
  };

  return await paginateListRequestOndeDoar({
    page,
    per_page,
    query,
  });
});
