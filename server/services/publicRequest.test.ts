import { describe, test, expect } from "vitest";
import { toPublicRequest, toOndeDoarRequest } from "./publicRequest";

const FAKE_CPF = "00000000191";
const FAKE_REQUESTER = "requester-secret-id";

function fullRequest(extra: Record<string, unknown> = {}) {
  return {
    id: 7,
    requester_id: FAKE_REQUESTER,
    assisted_id: 3,
    local_name: "Hemocentro Teste",
    address: "Av. Teste, 1",
    city: "Cidade",
    state: "SP",
    local_latitude: -23.5,
    local_longitude: -46.6,
    review_status: "Approved" as const,
    review_message: "nota interna",
    active_campagin: true,
    expires_at: new Date("2030-01-01"),
    created_at: new Date("2026-01-01"),
    updated_at: new Date("2026-01-02"),
    assisted: {
      id: 3,
      cpf: FAKE_CPF,
      name: "Paciente Teste",
      blood_type: "O+" as const,
      photo_url: "https://example.com/p.jpg",
      created_at: new Date("2026-01-01"),
      updated_at: new Date("2026-01-02"),
    },
    ...extra,
  };
}

describe("toPublicRequest", () => {
  test("keeps only the fields the public pages show", () => {
    const result = toPublicRequest(fullRequest());

    expect(Object.keys(result).sort()).toEqual(
      ["address", "assisted", "id", "local_name"].sort(),
    );
    expect(Object.keys(result.assisted).sort()).toEqual(
      ["blood_type", "name", "photo_url"].sort(),
    );
    expect(result).toEqual({
      id: 7,
      local_name: "Hemocentro Teste",
      address: "Av. Teste, 1",
      assisted: {
        name: "Paciente Teste",
        blood_type: "O+",
        photo_url: "https://example.com/p.jpg",
      },
    });
  });

  test("never serializes the CPF or the requester id", () => {
    const json = JSON.stringify(toPublicRequest(fullRequest()));

    expect(json).not.toContain(FAKE_CPF);
    expect(json).not.toContain(FAKE_REQUESTER);
    expect(json).not.toContain("cpf");
    expect(json).not.toContain("requester_id");
  });

  test("keeps distanceKm when the list was filtered by location", () => {
    const result = toPublicRequest(fullRequest({ distanceKm: 1.5 }));

    expect(result.distanceKm).toBe(1.5);
    expect(JSON.stringify(result)).not.toContain(FAKE_CPF);
  });
});

describe("toOndeDoarRequest", () => {
  test("keeps only the fields the onde-doar sync reads", () => {
    const result = toOndeDoarRequest(fullRequest());

    expect(Object.keys(result).sort()).toEqual(
      [
        "active_campagin",
        "address",
        "city",
        "created_at",
        "id",
        "local_latitude",
        "local_longitude",
        "local_name",
        "review_status",
        "state",
        "updated_at",
      ].sort(),
    );
    const json = JSON.stringify(result);
    expect(json).not.toContain(FAKE_CPF);
    expect(json).not.toContain(FAKE_REQUESTER);
    expect(json).not.toContain("Paciente Teste");
  });
});
