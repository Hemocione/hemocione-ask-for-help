import type { BloodType } from "~/types/blood";
import { decodeB64 } from "./decodeB64";

export interface CurrentUserData {
  id: string;
  givenName: string;
  surName: string;
  bloodType: BloodType;
  email: string;
  phone: string;
  document: string;
}

export const currentUserTokenDecoder = (token: string) => {
  const jwtBodyRaw = token.split(".")[1];
  if (!jwtBodyRaw) return null;

  const jwtBody = decodeB64(jwtBodyRaw);
  const jwtBodyDecoded: CurrentUserData = JSON.parse(jwtBody);
  return jwtBodyDecoded;
};
