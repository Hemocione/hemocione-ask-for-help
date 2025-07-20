import { createRequest } from "~/server/services/requestService";
import { DBBloodTypes } from "~/types/blood";
import { States } from "~/types/state";
import z from "zod";
import { getDiscordNotificationService } from "~/server/services/discord";
import { runAsync } from "~/server/utils/runAsync";

const CreateRequestSchema = z.object({
  local_name: z.string(),
  address: z.string(),
  city: z.string().optional(),
  state: z.enum(States).optional(),
  cpf: z.string(),
  name: z.string(),
  local_latitude: z.number(),
  local_longitude: z.number(),
  blood_type: z.enum(DBBloodTypes),
  photo_url: z.string().optional(),
  requester_id: z.string(),
});

export type Request = z.infer<typeof CreateRequestSchema>;

export default defineEventHandler(async (event) => {
  const {
    blood_type,
    cpf,
    local_name,
    address,
    city,
    state,
    name,
    photo_url,
    requester_id,
    local_latitude,
    local_longitude,
  } = await readValidatedBody(event, CreateRequestSchema.parse);

  const createdRequest = await createRequest(
    {
      blood_type,
      cpf,
      local_name,
      address,
      city,
      state,
      name,
      local_latitude,
      local_longitude,
      photo_url,
    },
    requester_id,
  );

  const discordNotificationService = getDiscordNotificationService();

  // Alerta no discord para revisão
  const embedPromise = discordNotificationService.sendEmbed({
    title: "🆕 Nova Solicitação de Doação",
    description: "Uma nova solicitação foi criada e precisa de revisão!",
    color: 0xffd700,
    fields: [
      {
        name: "👤 Solicitante",
        value: name,
        inline: true,
      },
      {
        name: "🩸 Tipo Sanguíneo",
        value: blood_type,
        inline: true,
      },
      {
        name: "📍 Local",
        value: `${local_name}\n${address}${city ? `\n${city} - ${state}` : ""}`,
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: `ID da Solicitação: ${createdRequest.id}`,
    },
  });

  runAsync(embedPromise);

  return createdRequest;
});
