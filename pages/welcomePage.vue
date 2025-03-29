<template>
  <div class="app-container z-50  absolute overflow-hidden inset-0">
    <div class="main">
      <img
        src="../public/images/hemo_logo.svg"
        alt="Logo da hemocione"
        class="small-image"
      />
      <h2 class="pb-2">Pedir ajuda</h2>
      <p class="max-w-[80%] text-[--black-80]">
        Conectando pessoas que precisam de ajuda, com pessoas que gostam de
        ajudar.
      </p>
      <img
        src="../public/images/rafiki.svg"
        alt="Imagem ilustrativa de uma pessoa doando sangue"
        class="large-image"
      />
    </div>

    <!-- Caixa Vermelha -->
    <div class="red-box" alt="button" @click="onClick">
      <NuxtLink to="/" class="text-xl">Clique para salvar vidas</NuxtLink>
      <img
        src="../public/images/arrow.svg"
        class="arrow"
        alt="Setinha para prosseguir no aplicativo"
      />
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const emits = defineEmits(["close"]);

setLocalStorage("welcomeAlreadyShown", true);

function onClick() {
  emits("close");
}
</script>

<style scoped>
@media screen and (max-width: 600px) {
  .large-image {
    width: 90% !important;
    height: 90% !important;
  }
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center; 
  text-align: center; 
  background-color: var(--hemo-color-primary);
  overflow: hidden;
}

header {
  padding: 1rem;
  width: 100%;
}

.small-image {
  max-width: 100px; 
  display: block;
  margin: 0 auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.large-image {
  width: 70% !important;
  height: 50% !important;
  margin-top: 5rem;
}

.main {
  height: 90vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0;
  margin-top: 0; 
  overflow: hidden; 
  background-color: var(--hemo-color-secondary);
  width: 100vw;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
}

.main h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 0px;
}

.main p {
  font-size: 16px;
  font-weight: normal;
  line-height: 1.5;
}

.red-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 0; /* Remove o padding superior */
  margin-top: 0; /* Remove qualquer margem superior */
  overflow: hidden; /* Garante que conteúdo extra não vá além dessa altura */
  height: 15vh;
  color: var(--hemo-color-secondary);
  font-weight: 600;
  gap: 20px;
  justify-content: center;
  text-align: center;
}

.arrow {
  margin-top: 4px;
  width: 20px;
  height: 20px;
}
</style>
