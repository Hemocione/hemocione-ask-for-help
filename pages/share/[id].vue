<template>
  <div class="h-screen px-10 py-16">
    <img src="/images/x.svg" alt="Botão em formato X para fechar" @click="goBack" class="absolute top-5 left-5" />
    <OgImageTemplateRequestDetails :name="request?.assisted.name" :bloodType="request?.assisted.blood_type"
      :location="request?.local_name" :photoURL="request?.assisted.photo_url" />

    <div class="flex flex-row items-center justify-center gap-10 mt-6">
      <a :href="instagramShareUrl" target="_blank" class="flex flex-col items-center justify-between gap-2">
        <img src="/images/instagram_colorido.svg" alt="Logo do instagram" />
        <span>Stories</span>
      </a>

      <a :href="whatsappShareUrl" target="_blank" class="flex flex-col items-center justify-between gap-2">
        <img src="/images/whatsapp.svg" alt="Logo do whatsapp" />
        <span>WhatsApp</span>
      </a>

      <button @click="copyShareLink" class="flex flex-col items-center justify-between gap-2">
        <img src="/images/plus_share.svg" alt="Icone de mais" />
        <span>Mais</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  hideHeader: true,
});

import type { RequestWithAssisted } from "~/server/services/requestService";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const request = ref<RequestWithAssisted | null>(null);

const goBack = () => {
  router.back()
}

request.value = await $fetch(`/api/request/${id}`, {
  method: "GET",
});

const currentUrl = computed(() => window?.location?.href ?? '');
const instagramShareUrl = computed(() => `https://www.instagram.com/share?url=${encodeURIComponent(currentUrl.value)}`);
const whatsappShareUrl = computed(() => `https://wa.me/?text=${encodeURIComponent(currentUrl.value)}`);

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    alert("Link copiado para a área de transferência!");
  } catch (error) {
    console.error("Erro ao copiar o link:", error);
  }
};
</script>
