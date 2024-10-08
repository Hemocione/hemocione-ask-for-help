<template>
  <div class="app-container">
    <div class ="main">
      <img src="../public/images/hemo_logo.svg" alt="Small Top Image" class="small-image"/>
      <img src="../public/images/rafiki.svg" alt="Large Center Image" class="large-image" />
      <h2>Pedir ajuda</h2>
      <p>Ajude e seja ajudado. <br>Salve uma vida.</p>
    </div>

    <!-- Caixa Vermelha -->
    
    <div class="red-box" alt="button" @click="onClick">
      <h3>Peça agora</h3>
      <img src="../public/images/arrow.svg" alt="Arrow" class="arrow"/>
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';

function onClick() {
  console.log('Button clicked');
}

</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center; /* Center content horizontally */
  text-align: center;  /* Center the text in the main section */
  background-color: var(--hemo-color-primary);
  width: 100vw;

}

header {
  padding: 1rem;
  width: 100%;

}

.small-image {
  max-width: 100px; /* Small image at the top */
  display: block;
  margin: 0 auto; /* Center image horizontally */
  margin-top: 1rem; 
}

.large-image {
  width: 90%;
  height: 90%;
  margin-top: 1rem; /* Diminui o espaço entre as duas imagens */

}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0; /* Remove o padding superior */
  margin-top: 0; /* Remove qualquer margem superior */
  height: 100%; /* Define uma altura máxima, você pode ajustar conforme necessário */
  overflow: hidden;  /* Garante que conteúdo extra não vá além dessa altura */
  background-color: var(--hemo-color-secondary);
  width: 100vw;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px; 


}

main h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 1rem;
}

main p {
  font-size: 16px;
  font-weight: normal;
  line-height: 1.5;
  margin-top: 0.5rem;
}

.red-box {
  display: flex;
  flex-direction: row; 
  align-items: center;
  padding-top: 0; /* Remove o padding superior */
  margin-top: 0; /* Remove qualquer margem superior */
  overflow: hidden;  /* Garante que conteúdo extra não vá além dessa altura */
  height: 15vh;
  color: var(--hemo-color-secondary);
  font-size: 22px;
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
