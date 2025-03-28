<template>
  <header
    class="h-[72px] flex flex-row items-center justify-between gap-4 p-5 bg-[--hemo-color-primary] h-[4.5rem] rounded-b-3xl w-full"
  >
    <div class="flex flex-row items-center gap-3">
      <img :src="imageURL" class="w-10 h-10 rounded-full" alt="Imagem do usuário logado"/>

      <p class="text-white">
        {{ dinamicTitle }}

        <NuxtLink v-if="!loggedIn" :to="authUrl" class="auth-button" external>
          <span class="text-white text-base bold">Faça Login</span>
        </NuxtLink>
      </p>
    </div>

    <!-- TODO: Integrar com o menu do app -->
    <!-- <button class="w-10 h-10 flex items-center justify-center">
      <img src="/public/images/hamburger.svg" alt="Menu" class="w-6 h-4" />
    </button> -->
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const route = useRoute();
const userStore = useUserStore();
const config = useRuntimeConfig();

const { hemocioneIdUrl, siteUrl } = config.public;

const imageURL = ref(
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pTNgFMam7sm-NMkeVDieflex5poRhb8HgA&s"
);

const loggedIn = computed(() => userStore.loggedIn);
const user = computed(() => userStore.user);

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
