<template>
  <div class="h-screen bg-white">
    <div class="p-4 flex-1 flex flex-col w-full gap-4 items-center pb-8 overflow-y-auto overflow-x-hidden" ref="elemScroll">
      <NuxtLink
        class="flex flex-row justify-start items-start w-full p-4"
        to="/"
      >
        <img
          class="w-6 h-6"
          src="/public/images/go-back.svg"
          alt="Setinha para voltar pra página anterior"
        />
      </NuxtLink>

      <div
        class="bg-[--mexican-chile] rounded-full flex items-center justify-center w-28 h-28"
        onclick="document.getElementById('file-input').click()"
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
          :class="isOwnPhoto ? 'w-full h-full object-cover rounded-full' : 'w-10 h-10 object-contain mx-auto my-auto'"
          :alt="isOwnPhoto ? 'Foto do solicitante' : 'Ícone de coração'"
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
          @input="formatCpf"
        ></ElInput>
        <p v-if="errors.cpf" class="text-red-500 text-sm">{{ errors.cpf }}</p>
      </div>

      <div class="w-full">
        <label>Tipo sanguíneo</label><span class="text-red-500">*</span>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-2">
          <el-button
            v-for="(type, idx) in bloodTypes"
            :key="idx"
            :class="{
              '!bg-[--hemo-color-primary] !text-[--hemo-color-text-primary]':
                isSelectedBloodType(type),
              'text-[--black-80] border border-[--black-60]':
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
    
      <div class="w-full">
        <div class="flex justify-between">
          <div>
            <label>Local para doação</label><span class="text-red-500">*</span>
          </div>
          <div class="flex justify-end" style="align-items: center;">
            <span class="text-xs mr-1">Não encontrei a localização</span>
            <ElSwitch
              v-model="bloodBankNotFound"
            />  
          </div>
        </div>
        <ElSelect 
          v-if="!bloodBankNotFound"
          v-model="requestSchema.local_name" 
          filterable
          placeholder="Insira Hospital ou Instituição"
        >
          <ElOption
            v-for="bank in bloodBanks"
            :key="bank.id"
            :label="bank.name"
            :value="bank.name"
            @click="selectedBloodBank(bank)"
          />
        </ElSelect>
        <ElInput
          v-else
          v-model="requestSchema.local_name"
          class="input"
          placeholder="Insira o nome do local para doação"
        />
        <p v-if="errors.local_name" class="text-red-500 text-sm">
          {{ errors.local_name }}
        </p>
      </div>

      <div class="w-full">
        <label>Endereço</label><span class="text-red-500">*</span>
        <ElInput
          class="input"
          placeholder="Insira o endereço do local para doação"
          v-model="requestSchema.address"
          :disabled="!bloodBankNotFound"
        ></ElInput>
      </div>
      <p v-if="errors.address" class="text-red-500 text-sm">
          {{ errors.address }}
      </p>

      <Transition
        enter-active-class="transform transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transform transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div v-if="bloodBankNotFound" class="w-full space-y-2">
          <label>Estado</label><span class="text-red-500">*</span>
          <el-select v-model="requestSchema.state" size="large" placeholder="Selecione o estado correspondente">
            <el-option
              v-for="state in States"
              :key="state"
              :label="state"
              :value="state"
            />
          </el-select>
          <p v-if="errors.state" class="text-red-500 text-sm">
              {{ errors.state }}
          </p>
        </div>
      </Transition>

      <Transition
        enter-active-class="transform transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transform transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div v-if="bloodBankNotFound" class="w-full space-y-2">
          <label>Cidade</label><span class="text-red-500">*</span>
          <el-select 
            v-model="requestSchema.city" 
            filterable 
            allow-create
            placeholder="Selecione ou digite a cidade"
          >
            <el-option
              v-for="city in cities"
              :key="city.value"
              :label="city.label"
              :value="city.value"
            />
          </el-select>
          <p v-if="errors.city" class="text-red-500 text-sm">
              {{ errors.city }}
          </p>
        </div>
      </Transition>

      </div>
    <div
      class="sticky p-4 !bottom-0 !left-0 !right-0 w-full bg-white shadow-lg"
    >
      <Button @click="registerRequest">Continuar</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import z from "zod";
import type { Request } from "~/server/api/request/index.post";
import { bloodTypes, DBBloodTypes, type BloodType } from "~/types/blood";
import { States } from "~/types/state"

definePageMeta({
  middleware: ["auth"],
});

const elemScroll = ref<HTMLElement | null>(null)
const cities = ref<{ value: string; label: string }[]>([]);
const requestSchema = ref<Request>({} as Request);
const errors = ref<{ [key: string]: string }>({});
const uploadingImage = ref(false);
const { token, user } = useUserStore();
const posthog = usePosthog();
const router = useRouter();

if (user?.id) {
  requestSchema.value.requester_id = user.id;
}

watch(
  requestSchema,
  async (newValue) => {
    for (const key in errors.value) {
      if (newValue[key as keyof typeof requestSchema.value]) {
        delete errors.value[key];
      }
    }
    if (newValue.state) {
      const fetched = await getCidadesFromEstado(newValue.state);

      cities.value = fetched.map((city) => ({
        value: city,
        label: city,
      }));
    }
  },
  { deep: true }
);

// Validação do formulário
const validationFormWithZod = () => {
  errors.value = {};

  try {
    const CreateRequestSchema = z.object({
      local_name: z.string({
        invalid_type_error: "Local de doação inválido",
        required_error: "Local de doação é obrigatório",
      }),
      address: z.string({
        invalid_type_error: "Endereço inválido",
        required_error: "Endereço é obrigatório",
      }),
      city: z.string({
        invalid_type_error: "Cidade inválida",
        required_error: "O Cidade é obrigatória",
      }).optional().refine((val) => {
        const isCustomLocation = !bloodBanks.value.some(bank => bank.name === requestSchema.value.local_name);
        if (isCustomLocation) {
          return !!val;
        }
        return true;
      }, { message: "Cidade é obrigatória quando o local não está na lista" }),
      state: z.string({
        invalid_type_error: "Estado inválido",
        required_error: "O Estado é obrigatório",
      }).optional().refine((val) => {
        const isCustomLocation = !bloodBanks.value.some(bank => bank.name === requestSchema.value.local_name);
        if (isCustomLocation) {
          return !!val;
        }
        return true;
      }, { message: "Estado é obrigatório quando o local não está na lista" }),
      cpf: z
        .string({
          required_error: "O CPF é obrigatório",
        })
        .min(11, "O CPF deve ter 11 dígitos")
        .max(14, "O CPF deve ter no máximo 14 caracteres")
        .refine(isValidCPF, { message: "CPF inválido" }),
      name: z.string({
        invalid_type_error: "Nome inválido",
        required_error: "Nome é obrigatório",
      }),
      blood_type: z.enum(DBBloodTypes, {
        invalid_type_error: "Tipo sanguíneo inválido",
        required_error: "Tipo sanguíneo é obrigatório",
      }),

      photo_url: z.string({
       required_error: "Foto é obrigatório",
     }),
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
  } finally {
    uploadingImage.value = false;
  }
}

const formatCpf = () => {
  let rawCpf = requestSchema.value.cpf.replace(/\D/g, ""); // Remove tudo que não for número

  if (rawCpf.length > 11) rawCpf = rawCpf.slice(0, 11); // Limita a 11 dígitos

  // Aplica a máscara de CPF dinamicamente
  requestSchema.value.cpf = rawCpf
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

// Envio do formulário
const registerRequest = async () => {
  const message = ElMessage({
    message: "Criando solicitação...",
    type: "info",
    duration: 0,
  });
  if (!validationFormWithZod()) {
    message.close();
    ElMessage({
      type: "error",
      message: errors.value[Object.keys(errors.value)[0]],
      duration: 3000,
    });
    return;
  }

  posthog?.capture("click_create_request");
  try {
    const result = await $fetch("/api/request", {
      method: "POST",
      body: requestSchema.value,
    });

    if (!result?.review_status) {
      await router.replace("/");
      return;
    }

    await router.push(`review/${result.review_status.toLowerCase()}`);

    message.close();
    ElMessage({
      message: "Solicitação criada com sucesso!",
      type: "success",
      duration: 3000,
    });
  } catch (err: any) {
    if (err.status === 409) {
      message.close();
      console.error("Erro ao criar solicitação", err);
      ElMessage({
        type: "error",
        message: "Já foi registrada uma solicitação com esse CPF",
        duration: 3000,
      });
    }
  }
};
const isSelectedBloodType = (type: BloodType) =>
  requestSchema.value.blood_type === bloodTypeToDbType(type);

// Photo URL computed
const photo_url = computed(
  () => requestSchema.value.photo_url || "images/gallery.svg"
);
const isOwnPhoto = computed(() => photo_url.value !== "images/gallery.svg");

const config = useRuntimeConfig();

interface BloodBank {
  name: string;
  address: string;
  id: string;
  latitude: number;
  longitude: number;
}

const {data} = await useFetch<BloodBank[]>(`${config.public.hemocioneIdApiUrl}/bloodBanks`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const bloodBanks = computed(() => data.value ?? []);
const bloodBankNotFound = ref(false);

const selectedBloodBank = (bank: BloodBank) => {
  requestSchema.value.address = bank.address;
  requestSchema.value.local_longitude = bank.longitude;
  requestSchema.value.local_latitude= bank.latitude;
  bloodBankNotFound.value = false;
}

watch(bloodBankNotFound, (newValue) => {
  requestSchema.value.local_name = '';
  requestSchema.value.address = '';

  setTimeout(() => {
    if(elemScroll.value && bloodBankNotFound.value) {
      elemScroll.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 300)
})

</script>

<style scoped>
.input {
  @apply !h-14 pt-2;
}
:deep(.el-select__wrapper) {
  @apply !h-12;
}
</style>
