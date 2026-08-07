import { describe, test, expect, afterAll } from "vitest";
import { dbClient } from "~/prisma";
import {
  createRequest,
  paginateListRequest,
  getRequestById,
  reviewRequest,
} from "./requestService";

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
});
