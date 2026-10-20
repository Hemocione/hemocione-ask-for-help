import { bloodReceiveCompatibilities, type BloodType } from "../types/blood";

// Um doador é compatível com o pedido quando seu tipo aparece na lista de
// quem pode doar para o tipo do assistido (bloodReceiveCompatibilities).
export function canDonateTo(
  donorBloodType: BloodType | null | undefined,
  recipientBloodType: BloodType
): boolean {
  if (!donorBloodType) return false;
  return bloodReceiveCompatibilities[recipientBloodType].includes(donorBloodType);
}
