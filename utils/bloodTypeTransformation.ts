const bloodType = {
  "A+": "A_POS",
  "A-": "A_NEG",
  "B+": "B_POS",
  "B-": "B_NEG",
  "AB+": "AB_POS",
  "AB-": "AB_NEG",
  "O+": "O_POS",
  "O-": "O_NEG",
} as const;
 
export type BloodTypeKeys = keyof typeof bloodType;
export type BloodTypeValues = typeof bloodType[BloodTypeKeys];


export function bloodTypeToDbType(key: BloodTypeKeys): BloodTypeValues | undefined {
  return bloodType[key];
}

export function dbTypeToBloodType(value: BloodTypeValues): BloodTypeKeys | undefined {
  return (Object.keys(bloodType) as BloodTypeKeys[]).find(
    (key) => bloodType[key] === value
  );
}