import z from "zod";
import { useHemocioneUserAuth } from "~/server/services/auth";
import { deleteRequestDonation } from "~/server/services/requestDonationService";

const RequestIdSchema = z.object({
  id: z.string().transform((str) => Number(str)),
});

export default defineEventHandler(async (event) => {
  const user = useHemocioneUserAuth(event);
  const token = getRequestHeader(event, "Authorization")!
    .replace("Bearer", "")
    .trim();
  const { id } = await getValidatedRouterParams(event, RequestIdSchema.parse);

  await deleteRequestDonation({ requestId: id, user, token });

  return { registered: false };
});
