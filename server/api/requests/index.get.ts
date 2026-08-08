import z from "zod";
import { paginateListRequest } from "~/server/services/requestService";
import { bloodTypes } from "~/types/blood";
import {
  bloodTypeToDbType,
  BloodTypeValues,
} from "~/utils/bloodTypeTransformation";

const ListRequestSchema = z.object({
  page: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  per_page: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  name: z.string().optional(),
  bloodTypes: z
    .preprocess((val) => (typeof val === "string" ? [val] : val), 
      z.array(
        z
          .enum(bloodTypes)
          .transform(bloodTypeToDbType)
      )
    )
    .optional(),
  latitude: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  longitude: z
    .string()
    .transform((str) => Number(str))
    .optional(),
  radiusKm: z
    .string()
    .transform((str) => Number(str))
    .optional(),
}).refine(
  (data) => {
    const hasLat = data.latitude !== undefined;
    const hasLng = data.longitude !== undefined;
    return (hasLat && hasLng) || (!hasLat && !hasLng);
  },
  { message: "latitude and longitude must be provided together" },
);

export type Request = z.infer<typeof ListRequestSchema>;

export default defineEventHandler(async (event) => {
  const { page, per_page, bloodTypes, name, latitude, longitude, radiusKm } = await getValidatedQuery(
    event,
    ListRequestSchema.parse
  );

  const query: {
    name?: string;
    bloodTypes?: BloodTypeValues[];
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  } = {};

  if (name) {
    query.name = name;
  }

  if (bloodTypes) {
    query.bloodTypes = bloodTypes.filter((e) => e !== undefined);
  }

  if (latitude !== undefined && longitude !== undefined) {
    query.latitude = latitude;
    query.longitude = longitude;
    query.radiusKm = radiusKm ?? 10;
  }

  return await paginateListRequest({
    page,
    per_page,
    query,
  });
});
