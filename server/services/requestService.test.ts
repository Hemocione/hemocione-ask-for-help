import { describe, test, expect, afterAll, vi } from "vitest";
import { dbClient } from "~/prisma";
import {
  createRequest,
  paginateListRequest,
  getRequestById,
  reviewRequest,
  isAutoApproveEnabled,
  getRequestExpirationDays,
  listPublicRequests,
  getPublicRequestById,
  listOndeDoarRequests,
} from "./requestService";

function withEnv<T>(name: string, value: string | undefined, fn: () => Promise<T>) {
  const previous = process.env[name];
  process.env[name] = value;
  return fn().finally(() => {
    process.env[name] = previous;
  });
}

describe("requestService", () => {
  afterAll(async () => {
    await dbClient.request.deleteMany();
    await dbClient.assisted.deleteMany();
    await dbClient.$disconnect();
  });

  test("createRequest stores a photo_url on the assisted person", async () => {
    const request = await createRequest(
      {
        local_name: "Hospital Teste",
        address: "Rua Teste, 123",
        cpf: "11111111111",
        name: "Fulano de Tal",
        blood_type: "O_POS",
        photo_url: "https://example.com/photo.jpg",
      },
      "requester-1",
    );

    const assisted = await dbClient.assisted.findUnique({
      where: { id: request.assisted_id },
    });

    expect(assisted?.photo_url).toBe("https://example.com/photo.jpg");
  });

  test("paginateListRequest returns approved requests including the assisted photo_url", async () => {
    const created = await createRequest(
      {
        local_name: "Hospital Teste 2",
        address: "Rua Teste, 456",
        cpf: "22222222222",
        name: "Ciclana de Tal",
        blood_type: "A_NEG",
        photo_url: "https://example.com/ciclana.jpg",
      },
      "requester-2",
    );

    await dbClient.request.update({
      where: { id: created.id },
      data: { review_status: "Approved" },
    });

    const results = await paginateListRequest({});

    const found = results.find((r) => r.id === created.id);
    expect(found?.assisted.photo_url).toBe("https://example.com/ciclana.jpg");
  });

  test("getRequestById does not leak requests still pending review", async () => {
    const previous = process.env.AUTO_APPROVE_REQUESTS;
    process.env.AUTO_APPROVE_REQUESTS = "0";
    try {
      const created = await createRequest(
        {
          local_name: "Hospital Teste 3",
          address: "Rua Teste, 789",
          cpf: "33333333333",
          name: "Beltrano de Tal",
          blood_type: "B_POS",
        },
        "requester-3",
      );

      const found = await getRequestById(created.id);

      expect(found).toBeNull();
    } finally {
      process.env.AUTO_APPROVE_REQUESTS = previous;
    }
  });

  test("getRequestById does not leak declined requests", async () => {
    const created = await createRequest(
      {
        local_name: "Hospital Teste 4",
        address: "Rua Teste, 101",
        cpf: "44444444444",
        name: "Sicrano de Tal",
        blood_type: "AB_NEG",
      },
      "requester-4",
    );
    await reviewRequest(created.id, { review_status: "Declined" });

    const found = await getRequestById(created.id);

    expect(found).toBeNull();
  });

  test("getRequestById returns approved and active requests", async () => {
    const created = await createRequest(
      {
        local_name: "Hospital Teste 5",
        address: "Rua Teste, 202",
        cpf: "55555555555",
        name: "Fulana de Tal",
        blood_type: "O_NEG",
      },
      "requester-5",
    );
    await reviewRequest(created.id, { review_status: "Approved" });

    const found = await getRequestById(created.id);

    expect(found?.id).toBe(created.id);
  });

  test("declining a request frees the CPF up for a new request", async () => {
    const firstAttempt = await createRequest(
      {
        local_name: "Hospital Teste 6",
        address: "Rua Teste, 303",
        cpf: "66666666666",
        name: "Ciclano de Tal",
        blood_type: "A_POS",
      },
      "requester-6",
    );
    await reviewRequest(firstAttempt.id, { review_status: "Declined" });

    const secondAttempt = createRequest(
      {
        local_name: "Hospital Teste 6 - segunda tentativa",
        address: "Rua Teste, 303",
        cpf: "66666666666",
        name: "Ciclano de Tal",
        blood_type: "A_POS",
      },
      "requester-6",
    );

    await expect(secondAttempt).resolves.not.toThrow();
  });

  describe("paginateListRequest with a location filter", () => {
    const saoPauloCenter = { latitude: -23.5505, longitude: -46.6333 };

    async function createApprovedRequest(opts: {
      cpf: string;
      name: string;
      local_latitude?: number;
      local_longitude?: number;
    }) {
      const created = await createRequest(
        {
          local_name: "Hospital Teste",
          address: "Rua Teste",
          cpf: opts.cpf,
          name: opts.name,
          blood_type: "O_POS",
          local_latitude: opts.local_latitude,
          local_longitude: opts.local_longitude,
        },
        `requester-${opts.cpf}`,
      );
      await reviewRequest(created.id, { review_status: "Approved" });
      return created;
    }

    test("returns only requests within radiusKm of the given point", async () => {
      const nearby = await createApprovedRequest({
        cpf: "77777777777",
        name: "Perto de Tal",
        // ~1.2km do centro de SP
        local_latitude: -23.56,
        local_longitude: -46.64,
      });
      const farAway = await createApprovedRequest({
        cpf: "88888888888",
        name: "Longe de Tal",
        // Rio de Janeiro, bem além de qualquer raio razoável
        local_latitude: -22.9068,
        local_longitude: -43.1729,
      });

      const results = await paginateListRequest({
        query: { ...saoPauloCenter, radiusKm: 10 },
      });
      const ids = results.map((r) => r.id);

      expect(ids).toContain(nearby.id);
      expect(ids).not.toContain(farAway.id);
    });

    test("excludes requests without coordinates when a location filter is active", async () => {
      const withoutCoords = await createApprovedRequest({
        cpf: "99999999999",
        name: "Sem Coordenada",
      });

      const results = await paginateListRequest({
        query: { ...saoPauloCenter, radiusKm: 10 },
      });

      expect(results.map((r) => r.id)).not.toContain(withoutCoords.id);
    });

    test("without a location filter, requests without coordinates still show up", async () => {
      const withoutCoords = await createApprovedRequest({
        cpf: "10101010101",
        name: "Sem Coordenada Dois",
      });

      const results = await paginateListRequest({});

      expect(results.map((r) => r.id)).toContain(withoutCoords.id);
    });

    test("orders results by distance, closest first", async () => {
      const far = await createApprovedRequest({
        cpf: "12121212121",
        name: "Média Distância",
        local_latitude: -23.6,
        local_longitude: -46.7,
      });
      const near = await createApprovedRequest({
        cpf: "13131313131",
        name: "Bem Perto",
        local_latitude: -23.551,
        local_longitude: -46.634,
      });

      const results = await paginateListRequest({
        query: { ...saoPauloCenter, radiusKm: 50 },
      });
      const ids = results.map((r) => r.id);
      const nearIndex = ids.indexOf(near.id);
      const farIndex = ids.indexOf(far.id);

      expect(nearIndex).toBeGreaterThanOrEqual(0);
      expect(farIndex).toBeGreaterThanOrEqual(0);
      expect(nearIndex).toBeLessThan(farIndex);
    });
  });

  describe("auto-approve toggle", () => {
    test("is enabled by default", async () => {
      await withEnv("AUTO_APPROVE_REQUESTS", undefined, async () => {
        expect(isAutoApproveEnabled()).toBe(true);
      });
    });

    test("createRequest approves immediately when auto-approve is on", async () => {
      const created = await withEnv("AUTO_APPROVE_REQUESTS", undefined, () =>
        createRequest(
          {
            local_name: "Hospital Teste 7",
            address: "Rua Teste, 404",
            cpf: "14141414141",
            name: "Autoaprovado de Tal",
            blood_type: "O_POS",
          },
          "requester-7",
        ),
      );

      expect(created.review_status).toBe("Approved");
    });

    test("createRequest stays Pending when AUTO_APPROVE_REQUESTS=0", async () => {
      const created = await withEnv("AUTO_APPROVE_REQUESTS", "0", () =>
        createRequest(
          {
            local_name: "Hospital Teste 8",
            address: "Rua Teste, 505",
            cpf: "15151515151",
            name: "Manual de Tal",
            blood_type: "AB_POS",
          },
          "requester-8",
        ),
      );

      expect(created.review_status).toBe("Pending");
    });
  });

  describe("admin hides/unhides a request", () => {
    test("hiding a request removes it from the public list without changing review_status", async () => {
      const created = await createRequest(
        {
          local_name: "Hospital Teste 9",
          address: "Rua Teste, 606",
          cpf: "16161616161",
          name: "Visivel de Tal",
          blood_type: "B_NEG",
        },
        "requester-9",
      );
      await reviewRequest(created.id, { review_status: "Approved" });

      await reviewRequest(created.id, { active_campagin: false });

      const results = await paginateListRequest({ per_page: 1000 });
      expect(results.map((r) => r.id)).not.toContain(created.id);

      const stillApproved = await dbClient.request.findUnique({
        where: { id: created.id },
      });
      expect(stillApproved?.review_status).toBe("Approved");
      expect(stillApproved?.active_campagin).toBe(false);
    });

    test("unhiding a request brings it back to the public list", async () => {
      const created = await createRequest(
        {
          local_name: "Hospital Teste 10",
          address: "Rua Teste, 707",
          cpf: "17171717171",
          name: "Reexibido de Tal",
          blood_type: "A_NEG",
        },
        "requester-10",
      );
      await reviewRequest(created.id, { review_status: "Approved" });
      await reviewRequest(created.id, { active_campagin: false });

      await reviewRequest(created.id, { active_campagin: true });

      const results = await paginateListRequest({ per_page: 1000 });
      expect(results.map((r) => r.id)).toContain(created.id);
    });
  });

  describe("expiração do pedido", () => {
    test("getRequestExpirationDays usa 30 dias por padrão", async () => {
      await withEnv("REQUEST_EXPIRATION_DAYS", undefined, async () => {
        expect(getRequestExpirationDays()).toBe(30);
      });
    });

    test("getRequestExpirationDays respeita a env var", async () => {
      await withEnv("REQUEST_EXPIRATION_DAYS", "7", async () => {
        expect(getRequestExpirationDays()).toBe(7);
      });
    });

    test("createRequest seta expires_at ~N dias no futuro", async () => {
      const created = await withEnv("REQUEST_EXPIRATION_DAYS", "10", () =>
        createRequest(
          {
            local_name: "Hospital Expira",
            address: "Rua Expira, 1",
            cpf: "18181818181",
            name: "Expira de Tal",
            blood_type: "O_POS",
          },
          "requester-expira-1",
        ),
      );

      expect(created.expires_at).not.toBeNull();
      const daysAhead =
        (created.expires_at!.getTime() - created.created_at.getTime()) /
        (1000 * 60 * 60 * 24);
      expect(daysAhead).toBeCloseTo(10, 1);
    });

    test("paginateListRequest exclui pedidos expirados", async () => {
      const created = await createRequest(
        {
          local_name: "Hospital Expirado",
          address: "Rua Expirado, 1",
          cpf: "19191919191",
          name: "Expirado de Tal",
          blood_type: "O_POS",
        },
        "requester-expira-2",
      );
      await dbClient.request.update({
        where: { id: created.id },
        data: { expires_at: new Date(Date.now() - 1000) },
      });

      const results = await paginateListRequest({ per_page: 1000 });
      expect(results.map((r) => r.id)).not.toContain(created.id);
    });

    test("paginateListRequest inclui pedidos sem expiração (legado)", async () => {
      const created = await createRequest(
        {
          local_name: "Hospital Legado",
          address: "Rua Legado, 1",
          cpf: "20202020212",
          name: "Legado de Tal",
          blood_type: "O_POS",
        },
        "requester-expira-3",
      );
      await dbClient.request.update({
        where: { id: created.id },
        data: { expires_at: null },
      });

      const results = await paginateListRequest({ per_page: 1000 });
      expect(results.map((r) => r.id)).toContain(created.id);
    });

    test("getRequestById retorna null para pedido expirado", async () => {
      const created = await createRequest(
        {
          local_name: "Hospital Expirado 2",
          address: "Rua Expirado, 2",
          cpf: "21212121213",
          name: "Expirado de Tal 2",
          blood_type: "O_POS",
        },
        "requester-expira-4",
      );
      await dbClient.request.update({
        where: { id: created.id },
        data: { expires_at: new Date(Date.now() - 1000) },
      });

      const found = await getRequestById(created.id);
      expect(found).toBeNull();
    });
  });

  describe("respostas públicas não expõem CPF nem requester_id", () => {
    const CPF = "00000000272";
    const REQUESTER = "requester-cpf-leak-check";

    function findKeys(value: unknown, keys: string[], path = "$"): string[] {
      if (Array.isArray(value)) {
        return value.flatMap((v, i) => findKeys(v, keys, `${path}[${i}]`));
      }
      if (value && typeof value === "object" && !(value instanceof Date)) {
        return Object.entries(value).flatMap(([k, v]) => [
          ...(keys.includes(k) ? [`${path}.${k}`] : []),
          ...findKeys(v, keys, `${path}.${k}`),
        ]);
      }
      return [];
    }

    async function createApproved() {
      await dbClient.request.updateMany({
        where: { assisted: { cpf: CPF } },
        data: { active_campagin: false },
      });
      const created = await createRequest(
        {
          local_name: "Hemocentro Vazamento",
          address: "Rua Vazamento, 1",
          cpf: CPF,
          name: "Paciente Vazamento",
          blood_type: "B_NEG",
          photo_url: "https://example.com/vazamento.jpg",
          local_latitude: -10.5,
          local_longitude: -40.5,
        },
        REQUESTER,
      );
      await dbClient.request.update({
        where: { id: created.id },
        data: { review_status: "Approved", active_campagin: true },
      });
      return created;
    }

    function expectNoSecrets(value: unknown) {
      expect(findKeys(value, ["cpf", "requester_id", "assisted_id"])).toEqual([]);
      const json = JSON.stringify(value);
      expect(json).not.toContain(CPF);
      expect(json).not.toContain(REQUESTER);
    }

    test("listPublicRequests (sem e com filtro de local)", async () => {
      const created = await createApproved();

      const plain = await listPublicRequests({ per_page: 1000 });
      const found = plain.find((r) => r.id === created.id);
      expect(found?.assisted).toEqual({
        name: "Paciente Vazamento",
        blood_type: "B-",
        photo_url: "https://example.com/vazamento.jpg",
      });
      expect(found?.local_name).toBe("Hemocentro Vazamento");
      expect(found?.address).toBe("Rua Vazamento, 1");
      expectNoSecrets(plain);

      const near = await listPublicRequests({
        query: { latitude: -10.5, longitude: -40.5, radiusKm: 5 },
      });
      expect(near.map((r) => r.id)).toContain(created.id);
      expectNoSecrets(near);
    });

    test("getPublicRequestById", async () => {
      const created = await createApproved();
      const found = await getPublicRequestById(created.id);

      expect(found?.assisted.name).toBe("Paciente Vazamento");
      expectNoSecrets(found);
    });

    test("listOndeDoarRequests não traz o paciente", async () => {
      const created = await createApproved();
      const all = await listOndeDoarRequests({ per_page: 1000 });

      expect(all.map((r) => r.id)).toContain(created.id);
      expectNoSecrets(all);
      expect(findKeys(all, ["assisted"])).toEqual([]);
    });

    describe("handlers reais das rotas", () => {
      async function loadHandler(path: string) {
        vi.resetModules();
        vi.stubGlobal("defineEventHandler", (fn: unknown) => fn);
        vi.stubGlobal("useRuntimeConfig", () => ({ secret: "test-secret" }));
        vi.stubGlobal("createError", (opts: { statusCode?: number }) =>
          Object.assign(new Error("http error"), opts),
        );
        vi.stubGlobal(
          "getValidatedQuery",
          async (event: { query: unknown }, parse: (v: unknown) => unknown) =>
            parse(event.query),
        );
        vi.stubGlobal(
          "getValidatedRouterParams",
          async (event: { params: unknown }, parse: (v: unknown) => unknown) =>
            parse(event.params),
        );
        vi.stubGlobal(
          "readValidatedBody",
          async (event: { body: unknown }, parse: (v: unknown) => unknown) =>
            parse(event.body),
        );
        return (await import(path)).default as (event: unknown) => Promise<unknown>;
      }

      afterAll(() => {
        vi.unstubAllGlobals();
      });

      test("GET /api/requests", async () => {
        const created = await createApproved();
        const handler = await loadHandler("~/server/api/requests/index.get");
        const result = (await handler({
          query: { per_page: "1000" },
          headers: new Headers(),
        })) as { id: number }[];

        expect(result.map((r) => r.id)).toContain(created.id);
        expectNoSecrets(result);
      });

      test("GET /api/request/:id", async () => {
        const created = await createApproved();
        const handler = await loadHandler("~/server/api/request/[id]/index.get");
        const result = await handler({
          params: { id: String(created.id) },
          headers: new Headers(),
        });

        expect(result).toMatchObject({ id: created.id });
        expectNoSecrets(result);
      });

      test("POST /api/points/onde-doar/sync exige o secret e não traz o paciente", async () => {
        const created = await createApproved();
        const handler = await loadHandler("~/server/api/points/onde-doar/sync.post");

        await expect(
          handler({ body: {}, headers: new Headers() }),
        ).rejects.toMatchObject({ statusCode: 401 });

        const result = (await handler({
          body: { per_page: "1000" },
          headers: new Headers({ "x-secret": "test-secret" }),
        })) as { id: number }[];

        expect(result.map((r) => r.id)).toContain(created.id);
        expectNoSecrets(result);
        expect(findKeys(result, ["assisted"])).toEqual([]);
      });

      test("GET /api/requests/pending continua exigindo o secret", async () => {
        const handler = await loadHandler("~/server/api/requests/pending.get");

        await expect(
          handler({ headers: new Headers() }),
        ).rejects.toMatchObject({ statusCode: 401 });
      });
    });
  });
});
