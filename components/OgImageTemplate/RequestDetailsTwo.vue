<template>
  <div
    :style="{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px',
      border: '1px solid var(--black-60)', borderRadius: '16px'
    }"
  >
    <!-- logo hemocione -->
    <img
      src="/images/assinatura_svg_b.svg"
      alt="Logo Hemocione"
      width="145"
    />

    <!-- Ajude com a sua doação! -->
    <h3 :style="{ fontWeight: '600', fontSize: '1.125rem', padding: '8px 0' }">Ajude com a sua doação!</h3>

    <!-- Imagem do solicitante -->
    <div :style="{
      borderRadius: '50%', border: '1px solid #B2493A', width: '224px', height: '224px', overflow: 'hidden'
    }">
      <img
        v-if="photoURL"
        :src="photoURL"
        :style="{ width: '100%', height: '100%', borderRadius: '50%' }"
        alt="Imagem do usuário solicitante que precisa de doação"
      />
    </div>

    <!-- Apelo -->
    <p :style="{
      fontSize: '0.875rem', textAlign: 'center', maxWidth: '70%', padding: '8px 0'
    }">
      Se não puder doar, compartilhe para alcançar o maior número de pessoas!
    </p>

    <!-- Informações do solicitante -->
    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '16px' }">
      <h2 :style="{ fontWeight: 'bold', fontSize: '1.25rem', paddingTop: '12px' }">{{ name }}</h2>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 0' }">
        <p :style="{ fontSize: '0.75rem', color: 'var(--black-80)' }">Tipo Sanguíneo</p>
        <div :style="{
          width: '32px', height: '16px', background: 'var(--hemo-color-primary)',
          color: 'white', borderRadius: '999px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '0.75rem', fontWeight: '500'
        }">
          {{ bloodType }}
        </div>
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px' }">
        <img src="/images/loc.svg" alt="Localização do usuário solicitante" />
        <p :style="{ fontSize: '0.75rem', color: 'var(--black-80)' }">{{ location }}</p>
      </div>
      <div :style="{ borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }">
        <p :style="{ fontSize: '1rem', fontWeight: '600', marginBottom: '20px' }">Tipos sanguíneos compatíveis</p>
        <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '0.875rem' }">
          <div
            v-for="(type, idx) in bloodTypes"
            :key="idx"
            :style="{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '20px',
              padding: '8px 10px', fontWeight: 'bold', borderRadius: '16px', border: '1px solid var(--black-60)',
              background: isCompatible(type) ? 'var(--cornflower-blue)' : 'transparent',
              borderColor: isCompatible(type) ? 'var(--cornflower-blue)' : 'var(--black-60)',
              color: isCompatible(type) ? 'white' : 'var(--black-60)'
            }"
          >
            {{ type }}
          </div>
        </div>
      </div>
    </div>
    <a :style="{ display: 'flex', flexDirection: 'row', gap: '4px' }" href="">
      <img src="/images/instagram.svg" alt="Instagram Hemocione" />
      <p :style="{ fontSize: '0.75rem', color: 'var(--hemo-color-primary)' }">Hemocione</p>
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