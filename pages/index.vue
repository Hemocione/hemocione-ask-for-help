<template>
  <div class="app-container">
    <header>
      <img src="../public/images/hemo_logo.svg" alt="Small Top Image" class="small-image"/>
    </header>

    <main>
      <img src="../public/images/rafiki.svg" alt="Large Center Image" class="large-image" />
      <h2>Pedir ajuda</h2>
      <p>Ajude e seja ajudado. <br>Salve uma vida.</p>
    </main>

    <footer>
      <p>&copy; 2024 My App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// No need for a title anymore since it's being replaced by static content
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center; /* Center content horizontally */
  text-align: center;  /* Center the text in the main section */
}

header {
  padding: 1rem;
  width: 100%;
}

.small-image {
  max-width: 100px; /* Small image at the top */
  display: block;
  margin: 0 auto; /* Center image horizontally */
}

.large-image {
  width: 150%;
  height: 150%;
  margin-top: 1rem; /* Diminui o espaço entre as duas imagens */

}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Alinha o conteúdo no topo */
  align-items: center;
  padding-top: 0; /* Remove o padding superior */
  margin-top: 0; /* Remove qualquer margem superior */
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


footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
  width: 100%;
}
</style>
