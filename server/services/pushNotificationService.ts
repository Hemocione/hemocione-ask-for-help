// O envio de push fica no hemocione-id, que é dono da integração com o
// OneSignal. Aqui só pedimos o envio, usando o Hemocione ID do usuário como
// destinatário.
export type PushContent = { title: string; body: string };

export type PushConfig = {
  hemocioneIdApiUrl: string;
  backofficeSecret: string;
};

export function getPushConfig(): PushConfig {
  const config = useRuntimeConfig();
  return {
    hemocioneIdApiUrl: config.public.hemocioneIdApiUrl,
    backofficeSecret: config.backofficeSecret,
  };
}

// Não lança erro: uma falha de push não deve derrubar a ação que a disparou
// (aprovar um pedido, registrar uma doação).
export async function sendPushToUser(
  externalId: string,
  content: PushContent,
  config: PushConfig
): Promise<void> {
  if (!config.hemocioneIdApiUrl || !config.backofficeSecret) {
    console.warn("Notificação não configurada: push não enviado");
    return;
  }

  try {
    await $fetch(`${config.hemocioneIdApiUrl}/notifications/push`, {
      method: "POST",
      headers: { "x-secret": config.backofficeSecret },
      body: {
        userIds: [externalId],
        title: content.title,
        body: content.body,
      },
    });
  } catch (error) {
    console.error("Falha ao enviar push pelo hemocione-id", error);
  }
}
