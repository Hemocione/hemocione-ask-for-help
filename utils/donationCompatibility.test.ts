import { describe, test, expect } from "vitest";
import { canDonateTo } from "./donationCompatibility";

describe("canDonateTo", () => {
  test("O- doa para qualquer tipo", () => {
    expect(canDonateTo("O-", "AB+")).toBe(true);
    expect(canDonateTo("O-", "O-")).toBe(true);
  });

  test("AB+ só doa para AB+", () => {
    expect(canDonateTo("AB+", "AB+")).toBe(true);
    expect(canDonateTo("AB+", "O+")).toBe(false);
  });

  test("A+ doa para A+ e AB+, mas não para O+", () => {
    expect(canDonateTo("A+", "A+")).toBe(true);
    expect(canDonateTo("A+", "AB+")).toBe(true);
    expect(canDonateTo("A+", "O+")).toBe(false);
  });

  test("sem tipo sanguíneo do doador, bloqueia", () => {
    expect(canDonateTo(undefined, "O+")).toBe(false);
    expect(canDonateTo(null, "O+")).toBe(false);
  });
});
