import { describe, test, expect, vi, afterEach } from "vitest";
import {
  buildOneSignalPayload,
  sendPushToUser,
} from "./pushNotificationService";

const credentials = { appId: "app-123", restApiKey: "key-abc" };
const content = { title: "Seu pedido foi aprovado", body: "Já está visível." };

describe("pushNotificationService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("buildOneSignalPayload usa o Hemocione ID como external_id", () => {
    const payload = buildOneSignalPayload(credentials.appId, "user-1", content);

    expect(payload.app_id).toBe("app-123");
    expect(payload.target_channel).toBe("push");
    expect(payload.include_aliases).toEqual({ external_id: ["user-1"] });
    expect(payload.headings.pt).toBe("Seu pedido foi aprovado");
    expect(payload.contents.pt).toBe("Já está visível.");
  });

  test("sem credenciais, não chama a API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("$fetch", fetchMock);

    await sendPushToUser("user-1", content, { appId: "", restApiKey: "" });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("com credenciais, envia para a API do OneSignal com a chave", async () => {
    const fetchMock = vi.fn().mockResolvedValue({});
    vi.stubGlobal("$fetch", fetchMock);

    await sendPushToUser("user-1", content, credentials);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://onesignal.com/api/v1/notifications",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Key key-abc" },
      })
    );
  });

  test("falha na API não lança erro para quem disparou", async () => {
    vi.stubGlobal("$fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      sendPushToUser("user-1", content, credentials)
    ).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
