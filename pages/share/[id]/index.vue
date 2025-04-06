<template>
  <div class="h-screen px-10 py-16">
    <img
      src="/images/x.svg"
      alt="Botão em formato X para fechar"
      @click="goBack"
      class="absolute top-5 left-5"
    />

    <OgImageTemplateRequestDetailsInstagram
      :name="request?.assisted.name"
      :bloodType="request?.assisted.blood_type"
      :location="request?.local_name"
      :photoURL="request?.assisted.photo_url"
    />

    <div class="flex flex-row items-center justify-center gap-10 mt-6">
      <div
        @click="() => shareHelpRequest(true)"
        class="flex flex-col items-center justify-between gap-2"
      >
        <img src="/images/instagram_colorido.svg" alt="Logo do instagram" />
        <span>Stories</span>
      </div>

      <NuxtLink
        :to="zapUrl"
        external
        target="_blank"
        class="flex flex-col items-center justify-between gap-2"
      >
        <img src="/images/whatsapp.svg" alt="Logo do whatsapp" />
        <span>WhatsApp</span>
      </NuxtLink>

      <button
        @click="() => shareHelpRequest(false)"
        class="flex flex-col items-center justify-between gap-2"
      >
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
  router.back();
};

request.value = await $fetch(`/api/request/${id}`, {
  method: "GET",
});

const currentUrl = ref("");
const config = useRuntimeConfig();

const instagramImageBlob = ref<Blob | null>(null);
const instagramImageLocalUrl = ref<string | null>(null);
const instagramImageUrl = ref<string | null>(null);
const shareUrl = ref<string | null>(null);

onMounted(async () => {
  currentUrl.value = window.location.href;
  const baseUrl = window.location.origin;

  shareUrl.value = `${baseUrl}/description/${id}`;

  instagramImageUrl.value = `${baseUrl}/__og-image__/image/share/${id}/instagram/og.png`;

  instagramImageBlob.value = await fetch(instagramImageUrl.value).then((res) =>
    res.blob()
  );
  if (!instagramImageBlob.value) return;

  instagramImageLocalUrl.value = URL.createObjectURL(instagramImageBlob.value);
});

const shareText = `${request.value?.assisted.name} precisa da nossa ajuda! Vamos salvar sua vida juntos?`;
const zapUrl = computed(() =>
  shareUrl.value
    ? getWhatsappUrl(shareText, shareUrl.value)
    : "#"
);

async function shareHelpRequest(withImage: boolean = false) {
  try {
    const data: {
      title: string;
      text: string;
      url: string;
      files?: File[];
    } = {
      title: `Hemocione - ${request.value?.assisted.name.split(" ")[0]}`,
      text: "Estou precisando da sua ajuda!",
      url: shareUrl.value!,
    };

    if (withImage && instagramImageBlob.value) {
      const instagramImageFile = new File(
        [instagramImageBlob.value],
        "instagram.png",
        {
          type: "image/png",
        }
      );
      data.files = [instagramImageFile];
    }

    const navigatorShareable = Boolean(navigator.canShare);

    if (navigatorShareable && navigator.canShare(data)) {
      await navigator.share(data);
    } else {
      navigator.clipboard.writeText(shareUrl.value!);
      ElMessage({
        message:
          "O link do pedido de ajuda foi copiado para a área de transferência.",
        type: "success",
      });
    }
  } catch (error) {
    ElMessage({
      message: "Não foi possível compartilhar o pedido de ajuda.",
      type: "error",
    });
  }
}

useHead({
  title: `Pedir Ajuda - ${request.value?.assisted.name ?? ""}`,
});

useServerSeoMeta({
  title: `${request.value?.assisted.name ?? "Pedido de ajuda"}`,
  ogTitle: `${request.value?.assisted.name ?? "Pedido de ajuda"}`,
  description: `Pedido de ajuda da ${request.value?.assisted.name ?? "Solicitante"
    }`,
  ogDescription: `Pedido de ajuda da ${request.value?.assisted.name ?? "Solicitante"
    }`,
  twitterCard: "summary_large_image",
  fbAppId: "Hemocione",
  ogUrl: `${config.public.siteUrl}/share/${id}`,
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
    width: 800,
    height: 450,
  }
);
</script>
