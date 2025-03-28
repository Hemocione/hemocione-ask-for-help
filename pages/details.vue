<template>
  <div class="flex flex-col items-center">
    <!-- logo hemocione -->
    <img
      src="/images/assinatura_svg_b.svg"
      alt="Logo Hemocione"
      class="logo_hemocione"
      width="145"
    />

    <!-- Ajude com a sua doação! -->
    <h3>Ajude com a sua doação!</h3>

    <!-- Imagem do solicitante -->
    <div class="rounded-full border border-[#B2493A] w-56 h-56">
      <img
        v-if="imageURL"
        :src="imageURL!"
        class="rounded-full"
        alt="Imagem do usuário solicitante que precisa de doação"
      />
    </div>

    <!-- Apelo -->
    <p>
      Se não puder doar, compartilhe para alcançar o maior número de pessoas!
    </p>

    <!-- Informações do solicitante -->
    <div>
      <h2>{{ name }}</h2>
      <div>
        <p>Tipo Sanguíneo </p>
        <div>{{ bloodType }}</div>
      </div>
      <div>
        <img />
        <p>Hospital Federal de Bonsucesso</p>
      </div>
    </div>
  </div>

  <!-- Instagram Hemocione -->
  <div></div>
</template>
<script setup lang="ts">

type Props = {
  name: string
  bloodType: string
  location: string
  photoURL: string
}

withDefaults(defineProps<Props>(), {
  name: 'Nome do solicitante',
  bloodType: 'A+',
  location: 'Localização do solicitante',
  photoURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pTNgFMam7sm-NMkeVDieflex5poRhb8HgA&s'
})

const imageURL = ref(
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pTNgFMam7sm-NMkeVDieflex5poRhb8HgA&s"
);
</script>
