
export const uploadImage = async (file: File, auth: { userToken?: string, secret?: string }): Promise<{ url: string }> => {
  const config = useRuntimeConfig();
  const { userToken, secret } = auth;
  if (!userToken && !secret) {
    throw new Error("You need to provide a userToken or a secret");
  }

  const formData = new FormData();
  formData.append("image", file);
  return await $fetch(config.public.cdnUploadUrl, {
    method: "POST",
    headers: {
      ...( userToken ? { Authorization: `Bearer ${userToken}` } : {}),
      ...( secret ? { "x-secret": secret } : {}),
      ContentType: "multipart/form-data",
    },
    body: formData,
  }) as { url: string };
};