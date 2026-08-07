import { describe, test, expect, afterAll } from "vitest";
import { dbClient } from "~/prisma";
import { createRequest, paginateListRequest } from "./requestService";

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
});
