<template>
  <NuxtLayout>
    <div class="content-wrapper">
      <Header class="w-full" />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts"></script>
<style scoped>
.content-wrapper {
  width: 70vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 100%;
}
@media screen and (max-width: 753px) {
  .content-wrapper {
    width: 100vw;
  }
}
</style>
