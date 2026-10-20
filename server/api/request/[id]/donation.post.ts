import z from "zod";
import { useHemocioneUserAuth } from "~/server/services/auth";
import { createRequestDonation } from "~/server/services/requestDonationService";

const RequestIdSchema = z.object({
  id: z.string().transform((str) => Number(str)),
});

export default defineEventHandler(async (event) => {
  const user = useHemocioneUserAuth(event);
  const token = getRequestHeader(event, "Authorization")!
    .replace("Bearer", "")
    .trim();
  const { id } = await getValidatedRouterParams(event, RequestIdSchema.parse);

  const donation = await createRequestDonation({ requestId: id, user, token });

  setResponseStatus(event, 201);
  return { registered: true, status: donation.status };
});
