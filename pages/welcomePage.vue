<template>
  <div class="app-container">
    <div class="main">
      <img
        src="../public/images/hemo_logo.svg"
        alt="Small Top Image"
        class="small-image"
      />
      <h2>Pedir ajuda</h2>
      <p>
        Conectando pessoas que precisam de ajuda, com pessoas que gostam de
        ajudar.
      </p>
      <img
        src="../public/images/rafiki.svg"
        alt="Large Center Image"
        class="large-image"
      />
    </div>

    <!-- Caixa Vermelha -->
    <div class="red-box" alt="button" @click="onClick">
      <NuxtLink to="/main">Clique para salvar vidas</NuxtLink>
      <img src="../public/images/arrow.svg" alt="Arrow" class="arrow" />
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

setLocalStorage("welcomeAlreadyShown", true);

function onClick() {
  router.replace("/");
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
  align-items: center; /* Center content horizontally */
  text-align: center; /* Center the text in the main section */
  background-color: var(--hemo-color-primary);
}

header {
  padding: 1rem;
  width: 100%;
}

.small-image {
  max-width: 100px; /* Small image at the top */
  display: block;
  margin: 0 auto; /* Center image horizontally */
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.large-image {
  width: 35% !important;
  height: 30% !important;
  margin-top: 1rem; /* Diminui o espaço entre as duas imagens */
}

.main {
  height: 75vh; /* Define uma altura máxima, você pode ajustar conforme necessário */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0; /* Remove o padding superior */
  margin-top: 0; /* Remove qualquer margem superior */
  overflow: hidden; /* Garante que conteúdo extra não vá além dessa altura */
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
