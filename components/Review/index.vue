<template>
  <div class="h-dvh">
    <div class="p-4 flex-1 flex flex-col h-dvh w-full gap-4 items-center">
      <div class="flex flex-row justify-start items-start w-full p-4">
        <NuxtLink to="/">
          <img class="w-6 h-6" src="/public/images/go-back.svg" alt="Setinha para voltar pra página anterior"/>
        </NuxtLink>
      </div>
      <h4 class="font-medium pt-16">{{ title }}</h4>

      <div
        class="!w-44 !h-44 rounded-full flex items-center justify-center"
        :style="{ backgroundColor: backgroundColor }"
      >
        <img class="w-28 h-28" :src="photo_url" alt="Review Icon" />
      </div>

      <p class="text-center pt-5">
        {{ reason }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title: string;
  photo_url: string;
  reason: string;
  backgroundColor: string;
};

const { photo_url, reason, title } = defineProps<Props>();
</script>
