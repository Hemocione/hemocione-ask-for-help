<template>
  <div
    class="flex flex-col items-center justify-center p-4 border border-[--black-60] rounded-2xl"
  >
    <!-- logo hemocione -->
    <img
      src="/images/assinatura_svg_b.svg"
      alt="Logo Hemocione"
      class="logo_hemocione"
      width="145"
    />

    <!-- Ajude com a sua doação! -->
    <h3 class="font-semibold text-lg py-2">Ajude com a sua doação!</h3>

    <!-- Imagem do solicitante -->
    <div class="rounded-full border border-[#B2493A] w-44 h-44 sm:!w-56 sm:!h-56">
      <img
        v-if="photoURL"
        :src="photoURL!"
        class="rounded-full"
        alt="Imagem do usuário solicitante que precisa de doação"
      />
    </div>

    <!-- Apelo -->
    <p class="text-sm text-center max-w-[80%] py-2">
      Se não puder doar, compartilhe para alcançar o maior número de pessoas!
    </p>

    <!-- Informações do solicitante -->
    <div class="flex flex-col items-center justify-center pb-4">
      <h2 class="font-bold text-xl pt-3">{{ name }}</h2>
      <div class="flex items-center gap-1 py-2">
        <p class="text-xs text-[--black-80]">Tipo Sanguíneo</p>
        <div
          class="w-8 h-4 bg-[--hemo-color-primary] text-white rounded-full flex items-center justify-center text-xs font-medium"
        >
          {{ bloodType }}
        </div>
      </div>
      <div class="flex items-center gap-2 pb-4">
        <img src="/images/loc.svg" alt="Localização do usuário solicitante" />
        <p class="text-xs text-[--black-80]">{{ location }}</p>
      </div>
      <div class="rounded-lg flex flex-col items-center">
        <p class="text-base font-semibold mb-5">Tipos sanguíneos compatíveis</p>
        <div class="grid grid-cols-4 gap-4 text-sm">
          <div
            v-for="(type, idx) in bloodTypes"
            :key="idx"
            class="flex items-center justify-center w-10 h-5 px-5 py-2 font-bold border rounded-2xl border-[--black-60] text-[--black-60]"
            :class="{
              'bg-[--cornflower-blue] border-[--cornflower-blue] !text-white':
                isCompatible(type),
            }"
          >
            {{ type }}
          </div>
        </div>
      </div>
    </div>
    <a class="flex flex-row gap-1" href="">
      <img src="/images/instagram.svg" alt="Instagram Hemocione" />
      <p class="text-xs text-[--hemo-color-primary]">Hemocione</p>
    </a>
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
