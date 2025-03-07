import { createRequest } from "~/server/services/requestService";
import { DBBloodTypes } from "~/types/blood";
import z from "zod";

const CreateRequestSchema = z.object({
  local_name: z.string(),
  cpf: z.string(),
  name: z.string(),
  blood_type: z.enum(DBBloodTypes),
  photo_url: z.string().optional(),
  requester_id: z.string(), 
});

export type Request = z.infer<typeof CreateRequestSchema>;

export default defineEventHandler(async (event) => {
  const { blood_type, cpf, local_name, name, photo_url, requester_id } =
    await readValidatedBody(event, CreateRequestSchema.parse);

  return await createRequest(
    {
      blood_type,
      cpf,
      local_name,
      name,
      photo_url,
    },
    requester_id
  );
});
