<template>
  <ElDrawer
    :model-value="modelValue"
    @update:model-value="(value: boolean) => emit('update:modelValue', value)"
    direction="btt"
    title="Compartilhar pedido"
    size="100%"
    class="share-drawer"
  >
    <div class="flex flex-col items-center gap-6 px-6 pb-8">
      <OgImageTemplateRequestDetailsComponent
        :name="request?.assisted.name"
        :bloodType="request?.assisted.blood_type"
        :location="request?.local_name"
        :address="request?.address"
        :photoURL="request?.assisted.photo_url"
      />

      <div class="flex flex-row items-center justify-center gap-10">
        <div
          @click="() => shareHelpRequest(true)"
          class="flex flex-col items-center justify-between gap-2 cursor-pointer"
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
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useUserStore } from "~/stores/user";
import type { RequestWithAssisted } from "~/server/services/requestService";

const props = defineProps<{
  modelValue: boolean;
  request: RequestWithAssisted | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const userStore = useUserStore();

const instagramImageBlob = ref<Blob | null>(null);
const shareUrl = computed(() =>
  props.request
    ? `${window.location.origin}/description/${props.request.id}`
    : null
);

const shareText = computed(
  () =>
    `${props.request?.assisted.name ?? ""} precisa da nossa ajuda! Vamos salvar sua vida juntos?`
);
const zapUrl = computed(() =>
  shareUrl.value ? getWhatsappUrl(shareText.value, shareUrl.value) : "#"
);

// Pré-carrega a imagem assim que o pedido está disponível, não quando o
// drawer abre — o dialog não deve esperar um fetch de imagem pra aparecer.
// Precisa ficar restrito ao client: o watch com immediate roda durante o
// setup() no SSR também, e lá `window` não existe (derrubava a página com 500).
watch(
  () => props.request,
  async (request) => {
    if (!import.meta.client || !request || instagramImageBlob.value) return;

    const instagramImageUrl = `${window.location.origin}/__og-image__/image/share/${request.id}/instagram/og.png`;
    instagramImageBlob.value = await fetch(instagramImageUrl).then((res) =>
      res.blob()
    );
  },
  { immediate: true }
);

// O ElDrawer só monta o conteúdo do slot na primeira vez que abre — a foto do
// solicitante (usada no preview dentro do drawer) só começava a carregar
// nesse instante, correndo contra a animação de subida e aparecendo como se
// não tivesse carregado. Pré-carrega assim que o pedido chega, igual à
// imagem do Instagram acima.
watch(
  () => props.request?.assisted.photo_url,
  (photoUrl) => {
    if (!import.meta.client || !photoUrl) return;
    new Image().src = photoUrl;
  },
  { immediate: true }
);

async function shareHelpRequest(withImage: boolean = false) {
  try {
    const data: {
      title: string;
      text: string;
      url: string;
      files?: File[];
    } = {
      title: `Hemocione - ${props.request?.assisted.name.split(" ")[0]}`,
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

    if (userStore.iframed || navigator.share) {
      await useHemocioneSdk()?.share(data);
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
</script>
