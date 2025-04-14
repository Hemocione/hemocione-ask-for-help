<template>
  <div
    class="flex flex-col items-center justify-center p-4 border border-[#a0a4a8] rounded-2xl bg-white"
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
    <div class="rounded-full border border-[#B2493A] w-44 h-44">
      <img
        v-if="photoURL"
        :src="photoURL!"
        class="w-full h-full max-w-44 max-h-44 object-cover rounded-full"
        alt="Imagem do usuário solicitante que precisa de doação"
      />
    </div>

    <!-- Apelo -->
    <p class="text-sm text-center max-w-[80%] py-2">
      Se não puder doar, compartilhe para alcançar o maior número de pessoas!
    </p>

    <!-- Informações do solicitante -->
    <div class="flex flex-col items-center justify-center pb-4">
      <h2 class="font-bold text-xl text-center py-3">{{ name }}</h2>
      <div class="flex flex-row items-center gap-1">
        <p class="text-[#52575c]">Tipo Sanguíneo</p>
        <div
          class="w-8 h-4 bg-[#bb0a08] text-white rounded-full flex items-center justify-center text-xs font-medium"
        >
          {{ bloodType }}
        </div>
      </div>
      <div class="flex flex-row items-center gap-2 py-4">
        <img
          src="/images/loc.svg"
          alt="Localização do usuário solicitante"
          class="w-3 h-4"
        />
        <p class="text-[#52575c]">{{ location }}</p>
      </div>
      <div class="rounded-lg flex flex-col items-center">
        <p class="text-base font-semibold mb-5">Tipos sanguíneos compatíveis</p>
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
    <a
      class="flex flex-row justify-center items-center gap-1"
      href="https://www.instagram.com/hemocione"
    >
      <img
        src="/images/instagram.svg"
        alt="Instagram Hemocione"
        class="w-5 h-5"
      />
      <p class="text-xs text-[#bb0a08]">Hemocione</p>
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
