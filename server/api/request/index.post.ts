import { createRequest } from "~/server/services/requestService";
import z from "zod";
import { bloodTypeToDbType } from "~/utils/bloodTypeTransformation";

const CreateRequestSchema = z.object({
  local_name: z.string(),
  cpf: z.string(),
  name: z.string(),
  blood_type: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .transform((e) => bloodTypeToDbType(e)),
  photo_url: z.string().optional(),
});

export type Request = z.infer<typeof CreateRequestSchema>;

export default defineEventHandler(async (event) => {
  const { blood_type, cpf, local_name, name, photo_url } =
    await readValidatedBody(event, CreateRequestSchema.parse);

  const requester_id = 1; // TODO: add logged user id

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
