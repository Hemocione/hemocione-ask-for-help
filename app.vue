<template>
  <NuxtLayout>
    <div class="content-wrapper">
      <WelcomePage v-if="shouldShowWelcome" @close="isOpenWelcome = !isOpenWelcome"></WelcomePage>
      <template v-else>
        <Header class="sticky top-0 z-50" />
        <NuxtPage class="nuxt-page" keepalive />
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useServerSeoMeta({
  description:
    "Aplicativo para conectar pessoas que precisam de doações de sangue com doadores",
  ogDescription:
    "Aplicativo para conectar pessoas que precisam de doações de sangue com doadores",
  ogImage:
    "https://cdn.hemocione.com.br/events/uploads/1699940076138-logo_hemocione_fb-2(1).png",
  twitterCard: "summary_large_image",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
});

import WelcomePage from "~/pages/welcomePage.vue";

const isOpenWelcome = ref<boolean>(getLocalStorage("welcomeAlreadyShown"));
const shouldShowWelcome = computed(() => !isOpenWelcome.value);
</script>
<style scoped>
.content-wrapper {
  width: 70vw;
  display: flex;
  position: relative;
  justify-content: center;
  flex-direction: column;
  max-width: 100%;
  height: 100dvh;
}

.nuxt-page {
  flex-grow: 1;
  overflow: auto;
}
@media screen and (max-width: 753px) {
  .content-wrapper {
    width: 100vw;
  }
}
</style>
