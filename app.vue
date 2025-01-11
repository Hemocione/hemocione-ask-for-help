<template>
  <NuxtLayout>
    <Header class="fixed top-0 z-50" />
    <div class="content-wrapper">
      <NuxtPage class="pt-[4.5rem]" />
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
