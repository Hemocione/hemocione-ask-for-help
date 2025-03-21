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
