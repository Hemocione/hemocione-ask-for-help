// Push via OneSignal. O external_id é o Hemocione ID do usuário, o mesmo
// valor que o app envia no OneSignal.login(user.id).
const ONESIGNAL_API_URL = "https://onesignal.com/api/v1/notifications";

export type PushContent = { title: string; body: string };

export type OneSignalCredentials = { appId: string; restApiKey: string };

export function getOneSignalCredentials(): OneSignalCredentials {
  const config = useRuntimeConfig();
  return {
    appId: config.oneSignalAppId,
    restApiKey: config.oneSignalRestApiKey,
  };
}

export function buildOneSignalPayload(
  appId: string,
  externalId: string,
  content: PushContent
) {
  return {
    app_id: appId,
    target_channel: "push",
    include_aliases: { external_id: [externalId] },
    headings: { en: content.title, pt: content.title },
    contents: { en: content.body, pt: content.body },
  };
}

// Não lança erro: uma falha de push não deve derrubar a ação que a disparou
// (aprovar um pedido, registrar uma doação).
export async function sendPushToUser(
  externalId: string,
  content: PushContent,
  credentials: OneSignalCredentials
): Promise<void> {
  if (!credentials.appId || !credentials.restApiKey) {
    console.warn("OneSignal não configurado: push não enviado");
    return;
  }

  try {
    await $fetch(ONESIGNAL_API_URL, {
      method: "POST",
      headers: { Authorization: `Key ${credentials.restApiKey}` },
      body: buildOneSignalPayload(credentials.appId, externalId, content),
    });
  } catch (error) {
    console.error("Falha ao enviar push pelo OneSignal", error);
  }
}
