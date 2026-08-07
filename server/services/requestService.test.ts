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
});
