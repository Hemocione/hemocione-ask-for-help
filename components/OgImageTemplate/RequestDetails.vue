<template>
  <div class="flex flex-col justify-center items-center p-2">
    <!-- logo hemocione -->
    <img
      src="/images/assinatura_svg_b.svg"
      alt="Logo Hemocione"
      class="logo_hemocione"
      width="145"
    />

    <!-- Ajude com a sua doação! -->
    <h3 class="font-semibold text-lg">Ajude com a sua doação!</h3>

    <!-- Apelo -->
    <p class="text-sm text-center max-w-[80%]">
      Se não puder doar, compartilhe para alcançar o maior número de pessoas!
    </p>

    <!-- Imagem do solicitante -->
    <div class="flex flex-row items-center">
      <div class="rounded-full border border-[#B2493A] w-56 h-56">
        <img
          v-if="photoURL"
          :src="photoURL!"
          class="rounded-full"
          alt="Imagem do usuário solicitante que precisa de doação"
        />
      </div>

      <!-- Informações do solicitante -->
      <div class="flex flex-col justify-center items-center">
        <h2 class="font-bold text-xl text-center text-wrap">{{ name }}</h2>
        <div class="flex flex-row items-center gap-x-1">
          <p class="text-xs text-[#52575c]">Tipo Sanguíneo</p>
          <div
            class="w-8 h-4 bg-[#bb0a08] text-white rounded-full flex items-center justify-center text-xs font-medium"
          >
            {{ bloodType }}
          </div>
        </div>
        <div class="flex flex-row items-center gap-x-2">
          <img src="/images/loc.svg" alt="Localização do usuário solicitante" />
          <p class="text-xs text-[#52575c]">{{ location }}</p>
        </div>
        <div class="rounded-lg flex flex-col items-center">
          <p class="text-base font-semibold">Tipos sanguíneos compatíveis</p>
          <div
            class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm max-w-[240px]"
          >
            <div
              v-for="(type, idx) in bloodTypes"
              :key="idx"
              class="flex items-center justify-center w-10 h-5 px-5 py-2 font-bold border rounded-2xl border-[#a0a4a8] text-[#a0a4a8]"
              :class="{
                'bg-[#6e91c7] border-[#6e91c7] !text-white': isCompatible(type),
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
