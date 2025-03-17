import { getAllPendingRequests } from "~/server/services/requestService";
import { assertSecretAuth } from "~/server/services/auth";

export default defineEventHandler(async (event) => {
  // assertSecretAuth(event);
  
  return await getAllPendingRequests();
});
