import { dbClient } from "~/prisma";
import type { HemocioneUserAuthTokenData } from "~/server/services/auth";
import {
  getOneSignalCredentials,
  sendPushToUser,
} from "~/server/services/pushNotificationService";
import { getRequestById } from "~/server/services/requestService";
import { canDonateTo } from "~/utils/donationCompatibility";

type DonorRequestParams = {
  requestId: number;
  user: HemocioneUserAuthTokenData;
  token: string;
};

// Data de hoje no fuso de São Paulo, no formato AAAA-MM-DD.
function todayInSaoPaulo(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

function hemocioneIdApiUrl(): string {
  return useRuntimeConfig().public.hemocioneIdApiUrl;
}

function hemocioneIdHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getRequestDonation(
  requestId: number,
  donorId: string
) {
  return dbClient.requestDonation.findUnique({
    where: {
      request_id_donor_id: { request_id: requestId, donor_id: donorId },
    },
  });
}

export async function createRequestDonation({
  requestId,
  user,
  token,
}: DonorRequestParams) {
  const request = await getRequestById(requestId);
  if (!request) {
    throw createError({ statusCode: 404, statusMessage: "Request not found" });
  }

  const recipientBloodType = request.assisted.blood_type;
  if (!user.bloodType) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Complete seu tipo sanguíneo no Hemocione ID para registrar doação",
    });
  }
  if (!canDonateTo(user.bloodType, recipientBloodType)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Seu tipo sanguíneo não é compatível com este pedido",
    });
  }

  const existing = await getRequestDonation(requestId, user.id);
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "Você já registrou doação para este pedido",
    });
  }

  // O Hemocione ID é a fonte da doação. Ele pode recusar por intervalo mínimo
  // entre doações (409), e essa mensagem chega direto ao usuário.
  const remote = await $fetch<{ donation: { id: number } }>(
    `${hemocioneIdApiUrl()}/donations`,
    {
      method: "POST",
      headers: hemocioneIdHeaders(token),
      body: {
        donationDate: todayInSaoPaulo(),
        label: `Doação via Ajuda Aí - local ${request.local_name} & pedido #${request.id}`,
      },
    }
  ).catch((error) => {
    if (error?.response?.status === 409) {
      throw createError({
        statusCode: 409,
        statusMessage: error.data?.message ?? "Doação não permitida agora",
      });
    }
    throw createError({
      statusCode: 502,
      statusMessage: "Não foi possível registrar a doação no Hemocione ID",
    });
  });

  let donation;
  try {
    donation = await dbClient.requestDonation.create({
      data: {
        request_id: requestId,
        donor_id: user.id,
        donation_id: remote.donation.id,
      },
    });
  } catch (error) {
    // Se o registro local falhar, desfaz a doação no Hemocione ID para não
    // deixar um registro órfão lá.
    await $fetch(`${hemocioneIdApiUrl()}/donations/${remote.donation.id}`, {
      method: "DELETE",
      headers: hemocioneIdHeaders(token),
    }).catch(() => undefined);
    throw error;
  }

  // Quem doou não precisa ser avisado da própria doação.
  if (request.requester_id !== user.id) {
    await sendPushToUser(
      request.requester_id,
      {
        title: "Nova doação registrada",
        body: `Alguém registrou doação para o pedido de ${request.assisted.name}.`,
      },
      getOneSignalCredentials()
    );
  }

  return donation;
}

export async function deleteRequestDonation({
  requestId,
  user,
  token,
}: DonorRequestParams) {
  const existing = await getRequestDonation(requestId, user.id);
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Registro de doação não encontrado",
    });
  }

  // Remove primeiro no Hemocione ID. Se falhar, mantém o registro local para
  // o usuário tentar de novo. 404 remoto significa que já foi removido.
  await $fetch(`${hemocioneIdApiUrl()}/donations/${existing.donation_id}`, {
    method: "DELETE",
    headers: hemocioneIdHeaders(token),
  }).catch((error) => {
    if (error?.response?.status === 404) return;
    throw createError({
      statusCode: 502,
      statusMessage: "Não foi possível cancelar a doação no Hemocione ID",
    });
  });

  await dbClient.requestDonation.delete({ where: { id: existing.id } });
}
