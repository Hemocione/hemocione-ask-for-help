import { assertSecretAuth } from "~/server/services/auth";
import { reviewRequest } from "~/server/services/requestService";
import z from "zod";

const ReviewRequestBodySchema = z.object({
  review_status: z.enum(["Pending", "Approved", "Declined"]),
});
const ReviewRequestParamsSchema = z.object({
  id: z.string().transform((str) => Number(str)),
});

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const { review_status } = await readValidatedBody(
    event,
    ReviewRequestBodySchema.parse
  );
  const { id } = await getValidatedRouterParams(
    event,
    ReviewRequestParamsSchema.parse
  );
  await reviewRequest(id, {
    review_status,
  });

  return { success: true };
});
