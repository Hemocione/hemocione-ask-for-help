<template>
  <div class="h-dvh bg-white">
    <div class="p-4 flex-1 flex flex-col h-dvh w-full gap-4 items-center">
      <div class="flex flex-row justify-start items-start w-full p-4">
        <img
          class="w-6 h-6"
          src="/public/images/go-back.svg"
          @click="$router.back()"
        />
      </div>

      <div
        class="w-28 h-28 bg-[#CD6D71] rounded-full flex items-center justify-center"
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          @change="handleFileSelect($event)"
        />
        <img
          :src="photo_url"
          class="w-10 h-10"
          :class="{
            '!w-28 !h-28 !rounded-full': isOwnPhoto,
          }"
          :alt="isOwnPhoto ? 'Foto do solicitante' : 'Ícone de coração'"
          onclick="document.getElementById('file-input').click()"
        />
      </div>

      <div class="w-full">
        <label>Nome</label><span class="text-red-500">*</span>
        <ElInput
          class="input"
          placeholder="Insira o nome completo"
          v-model="requestSchema.name"
        ></ElInput>
        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
      </div>

      <div class="w-full">
        <label>Documentação de identificação</label
        ><span class="text-red-500">*</span>
        <ElInput
          class="input"
          placeholder="Insira o número de CPF"
          v-model="requestSchema.cpf"
        ></ElInput>
        <p v-if="errors.cpf" class="text-red-500 text-sm">{{ errors.cpf }}</p>
      </div>

      <div class="w-full">
        <label>Local para doação</label><span class="text-red-500">*</span>
        <ElInput
          class="input"
          placeholder="Insira Hospital ou Instituição"
          v-model="requestSchema.local_name"
        ></ElInput>
        <p v-if="errors.local_name" class="text-red-500 text-sm">
          {{ errors.local_name }}
        </p>
      </div>

      <div class="w-full">
        <label>Tipo sanguíneo</label><span class="text-red-500 mb-6">*</span>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <el-button
            v-for="(type, idx) in bloodTypes"
            :key="idx"
            :class="{
              '!bg-[#BB0A08] !text-white': isSelectedBloodType(type),
              'text-[#52575C] border border-[#A0A4A8]':
                !isSelectedBloodType(type),
            }"
            @click="requestSchema.blood_type = bloodTypeToDbType(type)!"
            size="default"
            type="default"
            class="rounded-2xl font-semibold min-w-[3.5rem] !h-10 flex items-center justify-center flex-1"
          >
            {{ type }}
          </el-button>
        </div>
        <p v-if="errors.blood_type" class="text-red-500 text-sm">
          {{ errors.blood_type }}
        </p>
      </div>
    </div>
    <div class="sticky p-4 bottom-0 left-0 w-full bg-white shadow-lg">
      <Button @click="registerRequest">Continuar</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import z from "zod";
import type { Request } from "~/server/api/request/index.post";
import { bloodTypes, DBBloodTypes, type BloodType } from "~/types/blood";

definePageMeta({
  middleware: ["auth"],
});

const requestSchema = ref<Request>({} as Request);
const errors = ref<{ [key: string]: string }>({});
const uploadingImage = ref(false);
const { token, user } = useUserStore();
const router = useRouter();

if (user?.id) {
  requestSchema.value.requester_id = user.id;
}

// Validação do formulário
const validationFormWithZod = () => {
  try {
    const CreateRequestSchema = z.object({
      local_name: z.string({
        invalid_type_error: "Endereço inválido",
        required_error: "O Endereço é obrigatório",
      }),
      cpf: z.string({
        invalid_type_error: "CPF inválido",
        required_error: "CPF é obrigatório",
      }),
      name: z.string({
        invalid_type_error: "Nome inválido",
        required_error: "Nome é obrigatório",
      }),
      blood_type: z.enum(DBBloodTypes, {
        invalid_type_error: "Tipo sanguíneo inválido",
        required_error: "Tipo sanguíneo é obrigatório",
      }),

      photo_url: z.string().optional(),
    });
    CreateRequestSchema.parse(requestSchema.value);
    return true;
  } catch (err: any) {
    type ZodError = {
      path: string[];
      message: string;
    };
    const zodErrors = err.errors as ZodError[];
    for (const error of zodErrors) {
      errors.value[error.path[0]] = error.message;
    }
    return false;
  }
};

async function handleFileSelect(event: any) {
  uploadingImage.value = true;
  const files = event.target?.files;
  if (!files.length) {
    return;
  }
  if (files.length > 1) {
    ElMessage.error("Envie apenas uma imagem.");
    return;
  }

  const file = files[0] as File;
  // check if file is an image
  if (!file.type.includes("image")) {
    ElMessage.error("Envie uma imagem válida.");
    return;
  }

  const MB = 1024 * 1024;
  // check if file is less than 5mb
  if (file.size > 5 * MB) {
    ElMessage.error("Envie uma imagem menor que 5 MB");
    return;
  }

  // TODO: check if File is older than competition start
  // TODO: check file location + add bloodbank to form

  const message = ElMessage({
    message: "Enviando imagem...",
    type: "info",
    duration: 0,
  });
  try {
    const { url } = await uploadImage(file, { userToken: String(token) });
    message.close();
    ElMessage({
      message: "Imagem enviada com sucesso!",
      type: "success",
      duration: 3000,
    });

    requestSchema.value.photo_url = url;
  } catch (error) {
    message.close();
    console.error("Error uploading image", error);
    ElMessage({
      type: "error",
      message: "Erro ao enviar imagem. Por favor, tente novamente.",
      duration: 3000,
    });
  }

  uploadingImage.value = false;
}

// Envio do formulário
const registerRequest = async () => {
  if (!validationFormWithZod()) {
    console.log("Formulário inválido:", errors.value);
    return;
  }

  try {
    const result = await $fetch("/api/request", {
      method: "POST",
      body: requestSchema.value,
    });

    if (!result?.review_status) {
      router.replace("/");
      return
    }

    router.push(`review/${result.review_status.toLowerCase()}`);

    console.log("Solicitação criada com sucesso", result);
  } catch (err) {
    console.log("Erro ao enviar solicitação", err);
  }
};
const isSelectedBloodType = (type: BloodType) =>
  requestSchema.value.blood_type === bloodTypeToDbType(type);

// Photo URL computed
const photo_url = computed(
  () => requestSchema.value.photo_url || "images/gallery.svg"
);
const isOwnPhoto = computed(() => photo_url.value !== "images/gallery.svg");
</script>

<style scoped>
.input {
  @apply h-14;
}
</style>
