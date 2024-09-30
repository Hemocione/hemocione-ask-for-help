<template>
  <div class="main">
    <header class="header">
      <NuxtLink :to="`/competition/${competitionSlug}`">
        <ElIcon>
          <ElIconArrowLeftBold />
        </ElIcon>
      </NuxtLink>
      <h2>Influencie pessoas a doarem sangue</h2>
    </header>
    <div class="main-container">
      <div class="success">
        <img src="/images/illustrations/hemo-friends.png" class="friends" />
        <p v-html="influencedMessage" />
        <div class="actions">
          <div class="action" @click="copyLink">
            <NuxtImg src="/images/icons/copy-link.svg" class="action-img" />
            Copiar Link
          </div>
          <NuxtLink
            :href="zapUrl"
            target="_blank"
            rel="noopener noreferrer"
            external
            class="action"
          >
            <NuxtImg src="/images/icons/zap.svg" class="action-img zap" />
            WhatsApp
          </NuxtLink>
          <div class="action" @click="more">
            <NuxtImg src="/images/icons/erllen-plus.svg" class="action-img" />
            Mais
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const userStore = useUserStore();
const competitionSlug = String(route.params.slug);
const competitionInfluence = await userStore.getCompetitionInfluence(
  competitionSlug
);
if (!competitionInfluence) {
  await navigateTo(`/competition/${competitionSlug}`);
  throw new Error("Competition not found");
}

const { data: competition } = await useFetch(
  `/api/v1/competitions/${competitionSlug}`
);
const { influence, shareUrl } = competitionInfluence;

const influencedMessage = computed(() => {
  const amountInfluence = influence.amountInfluence || 0;
  if (amountInfluence === 0) {
    return "Você ainda não influenciou ninguém a doar sangue 🥲. Compartilhe seu link e influencie outras pessoas a salvarem vidas!";
  }

  if (amountInfluence === 1) {
    return "Até agora você influenciou <b>1 pessoa</b> a doar sangue, salvando <b>4 vidas</b>! Continue compartilhando seu link e influenciando mais pessoas 😀";
  }

  return `Até agora você influenciou <b>${amountInfluence} pessoas</b> a doar sangue, salvando <b>${
    amountInfluence * 4
  } vidas</b>! Continue compartilhando seu link e influenciando mais pessoas 😀`;
});

const copyLink = useDebounceFn(() => {
  navigator.clipboard.writeText(shareUrl);
  ElMessage({
    message: "Link copiado para a área de transferência!",
    type: "success",
  });
}, 300);

const zapUrl = getInfluenceWhatsappUrl(
  shareUrl,
  competition.value?.name || "Copa Hemocione"
);

const more = async () => {
  const sharePayload = {
    title: competition.value?.name || "Copa Hemocione",
    text: `Me ajude a salvar vidas! Doe sangue e participe da Copa Hemocione "${competition.value?.name}" de doação de sangue.`,
    url: shareUrl,
  };
  try {
    if (!navigator.share) {
      throw new Error("Share API not available");
    }
    await navigator.share(sharePayload);
  } catch (error) {
    console.error("Error sharing", error);
    copyLink();
  }
};
</script>

<style scoped>
.success {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  justify-content: center;
  align-items: center;
  width: 80%;
  text-align: center;
  height: 100%;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  max-width: 95%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}

.action-img {
  cursor: pointer;
  width: 3rem;
  aspect-ratio: 1;
  border-radius: 25%;
  padding: 0.5rem;
  background-color: var(--crazy-gray);
}

.zap {
  background-color: var(--zap);
}

.success p {
  font-size: 1.2rem;
  margin: 0;
}

.copy-link {
  cursor: pointer;
  color: var(--hemo-color-primary-dark);
  font-weight: bold;
  word-wrap: break-word;
  white-space: wrap;
  text-align: center;
  max-width: 80%;
}

.header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #dbdde0;
}

.header h2 {
  font-size: 1.2rem;
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

.friends {
  width: 100%;
  max-width: 300px;
  height: auto;
}
</style>
