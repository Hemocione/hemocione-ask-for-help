<template>
  <el-container class="main-container">
    <el-main class="main-strip">
      <div class="summaries-list">
        <!-- Competition Header -->
        <h1 class="summary-title">
          <img class="icon" src="/images/icons/copa-icon.svg" alt="copa-icon" />
          Copas
        </h1>
        <p class="summary-subtitle">
          Clique em uma copa para registrar sua doação ou acessar as
          informações.
        </p>
        
        <div class="switch-container">
          <!-- Competition Status Switch -->
          <div class="switch-content">
            <div :class="onGoingSwitchClass" @click="switchOnGoing(true)">
              Disponíveis
            </div>
            <div :class="closedSwitchClass" @click="switchOnGoing(false)">
              Encerradas
            </div>
          </div>

          <!-- Competition Summaries -->
          <div v-if="!filteredSummaries.length" class="no-content">
            <p>
              {{
                `Ainda não há copas ${onGoing ? "disponíveis" : "encerradas"}`
              }}
            </p>
            <img src="../public/images/rafiki.svg" />
          </div>
        </div>
        <CompetitionSummary
          v-for="summary in filteredSummaries"
          class="summaryBox"
          :key="summary.slug"
          :title="summary.name"
          :start="summary.start"
          :end="summary.end"
          :slug="summary.slug"
          :banner_background="summary?.banner_background"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const onGoing = ref(true);

const { data: competitions } = await useAsyncData(
  "competitions",
  async () =>
    $fetch("/api/v1/competitions", {
      params: {
        kindView: onGoing.value ? "available" : "finished",
      },
    }),
  { watch: [onGoing] }
);

const summaries = (competitions.value ?? []).map((competition) => ({
  name: competition.name,
  start: dayjs(competition.start_at).toDate(),
  end: dayjs(competition.end_at).toDate(),
  slug: competition.slug,
  banner_background: competition.banner_background ?? undefined,
}));

const closedSummaries = computed(() =>
  summaries.filter((summary) => summary.end < dayjs().toDate())
);
const onGoingSummaries = computed(() =>
  summaries.filter((summary) => summary.end >= dayjs().toDate())
);
const filteredSummaries = computed(() =>
  onGoing.value ? onGoingSummaries.value : closedSummaries.value
);

const onGoingSwitchClass = computed(() => [
  "switch",
  onGoing.value ? "switch-on" : "switch-off",
]);

const closedSwitchClass = computed(() => [
  "switch",
  onGoing.value ? "switch-off" : "switch-on",
]);

function switchOnGoing(v: boolean) {
  if (v === onGoing.value) {
    return;
  }
  onGoing.value = v;
}
</script>

<style scoped>
.main-container {
  display: flex;
  width: 100%;
  min-height: var(--hemo-page-min-height);
  flex-direction: column;
}
.summaryBox {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.switch-container {
  display: flex;
  flex-direction: column;
}
.switch-content {
  display: flex;
  flex-direction: row;
}
.no-content {
  text-align: center;
}
.no-content p {
  font-weight: 700;
}
.no-content img {
  width: 60%;
  margin-top: 16px;
}
.header {
  padding: 0px;
}
.summary-title {
  margin: 0;
}
.summary-subtitle {
  margin: 10px 0 15px 0;
}
.switch {
  display: inline-block;
  height: 26px;
  margin-right: 40px;
  margin-bottom: 20px;
  cursor: pointer;
}
.switch-on {
  border-bottom: solid 5px #bb0a08;
}
.switch-off {
  color: gray;
}
.summaries-list {
  width: 100%;
  max-width: var(--hemo-page-max-width);
  height: 100%;
  min-height: var(--hemo-page-min-height);
  background-color: white;
  padding: 20px 5%;
}
.main-strip {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  padding: 0px;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 2px;
}
</style>
