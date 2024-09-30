<template>
  <NuxtLayout>
    <div class="content-wrapper">
      <NuxtWelcome />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.content-wrapper {
  width: 70vw;
  max-width: 100%;
}
@media screen and (max-width: 753px) {
  .content-wrapper {
    width: 100vw;
  }
}
</style>
