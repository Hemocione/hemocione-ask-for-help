<template>
  <div
    class="flex flex-row items-center min-h-32 justify-between w-full p-4 rounded-2xl border border-(--black-40) bg-[--black-5]"
  >
    <div class="flex flex-col justify-center w-7/12">
      <div class="mb-2">
        <!-- Name -->
        <h4 class="text-lg font-semibold">{{ requesterName }}</h4>
        <!-- Local -->
        <div class="flex flex-row items-center gap-3">
          <img
            src="/public/images/loc.svg"
            alt="Localização"
          />
          <p class="text-[--black-80]">
            {{ requesterLocal }}
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <!-- Blood Type -->
        <p class="text-sm text-[--black-80]">Tipo Sanguíneo</p>

        <div
          class="w-10 h-5 bg-[--hemo-color-primary] text-white rounded-full flex items-center justify-center text-sm font-medium"
        >
          {{ bloodType }}
        </div>
      </div>
    </div>
    <div
      class="rounded-full max-w-5/12 overflow-hidden border border-[--hemo-color-primary]"
    >
      <img
        :src="requesterPhoto"
        class="w-20 h-20 object-cover"
        alt="Requester Photo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

type Props = {
  requesterName: string;
  requesterLocal: string;
  requesterPhoto: string;
  bloodType: string;
};

defineProps<Props>();
</script>
