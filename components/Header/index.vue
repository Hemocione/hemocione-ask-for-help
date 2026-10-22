<template>
  <header
    class="h-[72px] flex flex-row items-center justify-between gap-4 p-5 bg-[--hemo-color-primary] h-[4.5rem] rounded-b-3xl w-full"
  >
    <div class="flex flex-row items-center gap-3">
      <img
        :src="imageURL"
        class="w-12 h-12 rounded-full bg-[--black-10]"
        alt="Imagem do usuário logado"
      />

      <p class="text-[--hemo-color-text-primary]">
        {{ dinamicTitle }}

        <NuxtLink :to="authUrl" class="auth-button" external>
          <span class="text-[--hemo-color-text-primary] text-base bold">{{
            loggedIn ? "Sair" : "Faça Login"
          }}</span>
        </NuxtLink>
      </p>
    </div>

    <button
      class="w-10 h-10 flex items-center justify-center"
      aria-label="Abrir menu"
      @click="menuOpen = true"
    >
      <img src="/images/hamburger.svg" alt="" class="w-6 h-4" />
    </button>

    <ElDrawer v-model="menuOpen" direction="rtl" size="70%" :with-header="false">
      <nav class="flex flex-col gap-4 text-lg">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.label"
          :to="item.href"
          class="py-2"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>

        <a
          v-for="item in externalMenuItems"
          :key="item.label"
          :href="item.href"
          target="_blank"
          rel="noopener"
          class="py-2"
        >
          {{ item.label }}
        </a>

        <NuxtLink v-if="loggedIn" :to="authUrl" external class="py-2">
          Sair
        </NuxtLink>
      </nav>
    </ElDrawer>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const route = useRoute();
const userStore = useUserStore();
const config = useRuntimeConfig();

const { hemocioneIdUrl, siteUrl } = config.public;

const menuOpen = ref(false);

const menuItems = [{ label: "Início", href: "/" }];

const externalMenuItems = [
  { label: "Eventos", href: "https://eventos.hemocione.com.br" },
  { label: "Competições", href: "https://copa.hemocione.com.br" },
  { label: "Onde doar", href: "https://ondedoar.hemocione.com.br" },
  { label: "Loja", href: "https://loja.hemocione.com.br" },
  { label: "Apoie", href: "https://apoie.hemocione.com.br" },
];

const user = computed(() => userStore.user);
const imageURL = computed(
  () =>
    `/illustrations/bloodCharacters/${
      !user.value?.bloodType ? "O-" : user.value?.bloodType
    }.svg`
);
const loggedIn = computed(() => userStore.loggedIn);
const loggedName = computed(
  () => user.value?.givenName + " " + user.value?.surName
);

const authUrl = computed(() => {
  const currentPath = route.fullPath;
  const redirectUrl = new URL(currentPath, siteUrl);
  redirectUrl.searchParams.delete("token");
  const encodedRedirectUrl = encodeURI(redirectUrl.toString());
  const baseAuthUrl = loggedIn.value
    ? `${hemocioneIdUrl}/signout`
    : `${hemocioneIdUrl}`;
  return `${baseAuthUrl}?redirect=${encodedRedirectUrl}`;
});

const dinamicTitle = computed(() =>
  loggedIn.value ? `Olá, ${loggedName.value}!` : "Quem é você?"
);
</script>

<style scoped></style>
