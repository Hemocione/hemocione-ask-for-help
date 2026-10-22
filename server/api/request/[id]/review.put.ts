import { assertSecretAuth } from "~/server/services/auth";
import { reviewRequest } from "~/server/services/requestService";
import {
  getPushConfig,
  sendPushToUser,
  type PushContent,
} from "~/server/services/pushNotificationService";
import z from "zod";

const REVIEW_PUSH: Partial<Record<"Approved" | "Declined", PushContent>> = {
  Approved: {
    title: "Seu pedido foi aprovado",
    body: "Ele já está visível na tela inicial.",
  },
  Declined: {
    title: "Seu pedido não foi aprovado",
    body: "Abra o app para ver os detalhes.",
  },
};

const ReviewRequestBodySchema = z
  .object({
    review_status: z.enum(["Pending", "Approved", "Declined"]).optional(),
    // Permite um admin esconder (ou reexibir) um pedido já publicado sem
    // necessariamente mudar o review_status — útil com auto-approve ligado,
    // onde não existe um passo de revisão manual antes da publicação.
    active_campagin: z.boolean().optional(),
  })
  .refine(
    (data) => data.review_status !== undefined || data.active_campagin !== undefined,
    { message: "Informe review_status e/ou active_campagin" }
  );
const ReviewRequestParamsSchema = z.object({
  id: z.string().transform((str) => Number(str)),
});

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const { review_status, active_campagin } = await readValidatedBody(
    event,
    ReviewRequestBodySchema.parse
  );
  const { id } = await getValidatedRouterParams(
    event,
    ReviewRequestParamsSchema.parse
  );
  const updated = await reviewRequest(id, {
    review_status,
    active_campagin,
  });

  const push =
    review_status === "Approved" || review_status === "Declined"
      ? REVIEW_PUSH[review_status]
      : undefined;
  if (push) {
    await sendPushToUser(updated.requester_id, push, getPushConfig());
  }

  return { success: true };
});
