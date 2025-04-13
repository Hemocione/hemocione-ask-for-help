<template>
  <div v-if="request" class="app-container">
    <div
      class="flex flex-row justify-start items-start w-full p-4 pt-6 cursor-pointer"
    >
      <img
        class="w-6 h-6"
        src="/public/images/go-back.svg"
        @click="$router.back()"
        alt="Setinha para voltar pra página anterior"
      />
    </div>

    <div class="main">
      <div class="person-image border border-[--hemo-color-primary]">
        <img
          v-if="request.assisted.photo_url"
          :src="request.assisted.photo_url!"
          alt="Imagem do usuário solicitante que precisa de doação"
        />
      </div>

      <div class="description">
        <div class="request-info">
          <h3>{{ request.assisted.name }}</h3>
          <span class="blood-container">
            <p class="text">Tipo Sanguíneo</p>
            <div
              class="w-10 h-5 bg-[--hemo-color-primary] text-white rounded-full flex items-center justify-center text-sm font-medium"
            >
              {{ request.assisted.blood_type }}
            </div>
          </span>

          <span class="location">
            <img
              src="/images/loc.svg"
              alt="Localização do usuário solicitante"
            />
            <p>{{ request.local_name }}</p>
          </span>
        </div>

        <div class="rounded-lg flex flex-col items-center">
          <p class="text-base font-semibold mb-5">
            Tipos sanguíneos compatíveis
          </p>
          <div class="grid grid-cols-4 gap-4 text-sm">
            <div
              v-for="(type, idx) in bloodTypes"
              :key="idx"
              class="flex items-center justify-center w-10 h-5 px-5 py-2 font-bold border rounded-2xl border-[--black-60] text-[--black-60]"
              :class="{
                'bg-[--cornflower-blue] border-[--cornflower-blue] !text-white':
                  isCompatible(type),
              }"
            >
              {{ type }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="register-donation" alt="button">
      <Button @click="shareDonation">
        <img
          src="/images/share_icon_white.svg"
          alt="icone de compartilhamento"
          class="share_icon"
        />
        Compartilhar este pedido
      </Button>
      <!-- TODO: adicionar quando implementar a lógica de registrar doação -->
      <!-- <Button @click="registerDonation">
				<img src="/images/plus_donation_gray.svg" alt="Plus_donation" class="plus_donation" width="20" height="20" />
				Registrar doação
			</Button> -->
    </div>
  </div>
  <!-- TODO: adicionar loading -->
  <div v-else>
    <p>Carregando...</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { RequestWithAssisted } from "~/server/services/requestService";
import {
  bloodReceiveCompatibilities,
  bloodTypes,
  type BloodType,
} from "~/types/blood";

const route = useRoute();
const router = useRouter();
const request = ref<RequestWithAssisted | null>(null);
const id = route.params.id;

const config = useRuntimeConfig();
const posthog = usePosthog();

request.value = await $fetch(`/api/request/${id}`, {
  method: "GET",
});

if (!request.value) router.push("/");

const shareDonation = () => {
  posthog?.capture("click_share_request");
  router.push(`/share/${id}`);
};
const registerDonation = () => {
  console.log("Button clicked");
};

const bloodCompatibilities = request.value
  ? bloodReceiveCompatibilities[request.value.assisted.blood_type]
  : [];

const isCompatible = (bloodType: BloodType) => {
  return bloodCompatibilities.includes(bloodType);
};

useHead({
  title: `Ajuda aí - ${request.value?.assisted.name ?? ""}`,
});

useServerSeoMeta({
  title: `${request.value?.assisted.name ?? "Pedido de ajuda"}`,
  ogTitle: `${request.value?.assisted.name ?? "Pedido de ajuda"}`,
  description: `Pedido de ajuda da ${
    request.value?.assisted.name ?? "Solicitante"
  }`,
  ogDescription: `Pedido de ajuda da ${
    request.value?.assisted.name ?? "Solicitante"
  }`,
  twitterCard: "summary_large_image",
  fbAppId: "Hemocione",
  ogUrl: `${config.public.siteUrl}/description/${id}`,
});

defineOgImageComponent(
  "RequestDetails",
  {
    name: request.value?.assisted.name ?? "",
    bloodType: request.value?.assisted.blood_type ?? "",
    photoURL: request.value?.assisted.photo_url ?? "",
    location: request.value?.local_name ?? "",
  },
  {
    width: 1000,
    height: 450,
  }
);
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: var(--black-0);
  width: 100%;
  height: 100vh;
}

header {
  padding: 1rem;
  width: 100%;
}

.main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 50px;
  width: 100%;
  padding: 20px;
}

.register-donation {
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  color: var(--hemo-color-secondary);
  background-color: var(--black-0);
  font-weight: 600;
  border: 2px solid var(--black-20);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
}

.register-donation .register-donation-text {
  font-size: 0.875rem;
  color: var(--black-80);
  border: 2px var(--black-60) solid;
  border-radius: 16px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.register-donation img {
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.person-image {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-color: var(--black-60);
  overflow: hidden;
}

.description {
  background-color: var(--black-5);
  border-radius: 16px;
  padding: 24px;
  border: 2px var(--black-10) solid;
  width: 100%;
}

.request-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.request-info h3 {
  font-size: 1.5rem;
  font-weight: 400;
}

.blood-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.blood-container .text {
  color: var(--black-80);
  font-weight: 500;
  font-size: 1rem;
}

.location {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--black-80);
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
