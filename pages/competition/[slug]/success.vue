<template>
  <div class="main">
    <div class="main-container">
      <header class="header">
        <h2>{{ name || "Copa Hemocione" }}</h2>
      </header>
      <div class="success">
        <img src="/images/check-donation.svg" alt="checked-icon" />
        <span
          >Doação registrada com sucesso! Obrigado por salvar 4 vidas :)</span
        >
      </div>
    </div>
    <common-cool-footer
      hide-toggle
      height="fit-content"
      desktop-border-radius="0"
    >
      <NuxtLink :to="`/competition/${slug}`">
        <el-button type="default" size="large" style="width: 100%"
          >Voltar para {{ name }}</el-button
        >
      </NuxtLink>
      <NuxtLink
        :to="`/competition/${slug}/influence`"
        v-if="competition?.has_influence"
      >
        <el-button size="large" type="primary" style="width: 100%">
          <template #icon>
            <el-icon><ElIconShare /></el-icon>
          </template>
          Influencie mais pessoas a doarem sangue
        </el-button>
      </NuxtLink>
      <NuxtLink
        :to="instagramUrl"
        v-else
        target="_blank"
        rel="noopener noreferrer"
        external
      >
        <el-button size="large" type="primary" style="width: 100%">
          Siga o Hemocione no Instagram
          <el-icon class="el-icon--right" size="30">
            <NuxtImg src="/images/icons/instagram.svg" style="height: 100%" />
          </el-icon>
        </el-button>
      </NuxtLink>
    </common-cool-footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
const { instagramUrl } = useRuntimeConfig().public;
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const slug = route.params.slug;
const name = route.query.name;
const { getDonationByCompetitionSlug } = useUserStore();

const [donation, { data: competition }] = await Promise.all([
  getDonationByCompetitionSlug(String(slug)),
  useFetch(`/api/v1/competitions/${slug}`),
]);

if (!donation) {
  navigateTo(`/competition/${slug}/register`);
}
const openInstagram = () => {
  navigateTo(instagramUrl, { external: true });
};
</script>

<style scoped>
.success {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  width: 80%;
  text-align: center;
  height: 100%;
}
.header {
  width: 100%;
}

.header h2 {
  font-size: 2rem;
  margin: 0;
}

.main {
  display: flex;
  flex-direction: column;
  height: var(--hemo-page-min-height);
  width: 100%;
  max-width: var(--hemo-page-max-width);
  position: relative;
}

.main-container {
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 1rem;
}

.main-container h2 {
  font-size: 2rem;
  justify-self: flex-start;
}
</style>
