<template>
  <div class="flex flex-col justify-center items-start h-full pl-20 bg-white">
    <div class="flex flex-row items-center gap-4">
      <div class="rounded-full border border-[#B2493A] w-[300px] h-[300px]">
        <img
          v-if="photoURL"
          :src="photoURL!"
          class="w-full h-full max-w-[300px] max-h-[300px] object-cover rounded-full"
          alt="Imagem do usuário solicitante que precisa de doação"
        />
      </div>

      <div class="flex flex-col justify-center items-center max-w-[60%]">
        <h2 class="font-bold text-4xl text-center text-wrap">{{ name }}</h2>
        <div class="flex flex-row items-center gap-x-2 pb-4">
          <img
            src="/images/loc.svg"
            alt="Localização do usuário solicitante"
            class="w-10 h-12"
          />
          <p
            class="text-4xl font-bold text-[#52575c] truncate whitespace-nowrap overflow-hidden max-w-[500px]"
          >
            {{ location }}
          </p>
        </div>
        <div class="rounded-lg flex flex-col items-center">
          <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-4xl">
            <div
              v-for="(type, idx) in bloodTypes"
              :key="idx"
              class="flex items-center justify-center w-25 h-20 px-5 py-2 font-bold border rounded-2xl border-[#a0a4a8] text-[#a0a4a8]"
              :class="{
                'bg-[#6e91c7] border-[#6e91c7] text-white': isCompatible(type),
              }"
            >
              {{ type }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  name: string;
  bloodType: BloodType;
  location: string;
  photoURL: string;
}>();

const bloodReceiveCompatibilities: Record<BloodType, BloodType[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
type BloodType = (typeof bloodTypes)[number];

const isCompatible = (bloodType: BloodType) => {
  return (
    bloodReceiveCompatibilities[props.bloodType]?.includes(bloodType) || false
  );
};
</script>
