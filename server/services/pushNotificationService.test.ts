import { describe, test, expect, vi, afterEach } from "vitest";
import { sendPushToUser, type PushConfig } from "./pushNotificationService";

const config: PushConfig = {
  hemocioneIdApiUrl: "https://hemocione-id.test",
  notificationSecret: "s3cret",
};
const content = { title: "Seu pedido foi aprovado", body: "Já está visível." };

describe("pushNotificationService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("sem segredo configurado, não chama o hemocione-id", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("$fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await sendPushToUser("user-1", content, { ...config, notificationSecret: "" });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("envia para o endpoint interno com o segredo e o Hemocione ID", async () => {
    const fetchMock = vi.fn().mockResolvedValue({});
    vi.stubGlobal("$fetch", fetchMock);

    await sendPushToUser("user-1", content, config);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://hemocione-id.test/notifications/push",
      {
        method: "POST",
        headers: { "x-hemocione-notification-secret": "s3cret" },
        body: {
          userIds: ["user-1"],
          title: "Seu pedido foi aprovado",
          body: "Já está visível.",
        },
      }
    );
  });

  test("falha no envio não lança erro para quem disparou", async () => {
    vi.stubGlobal("$fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(sendPushToUser("user-1", content, config)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
