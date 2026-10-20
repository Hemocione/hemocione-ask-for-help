import z from "zod";
import { useHemocioneUserAuth } from "~/server/services/auth";
import { getRequestDonation } from "~/server/services/requestDonationService";

const RequestIdSchema = z.object({
  id: z.string().transform((str) => Number(str)),
});

export default defineEventHandler(async (event) => {
  const user = useHemocioneUserAuth(event);
  const { id } = await getValidatedRouterParams(event, RequestIdSchema.parse);

  const donation = await getRequestDonation(id, user.id);

  return { registered: Boolean(donation), status: donation?.status ?? null };
});
