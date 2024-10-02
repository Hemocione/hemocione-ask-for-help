<template>
  <NuxtLayout>
    <div class="content-wrapper">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Copa Hemocione",
  meta: [
    {
      hid: "description",
      name: "description",
      content:
        "Encontre copas de doação de sangue próximas a você e ajude a salvar vidas!",
    },
    {
      hid: "og:description",
      property: "og:description",
      content:
        "Encontre copas de doação de sangue próximas a você e ajude a salvar vidas!",
    },
    {
      hid: "og:image",
      property: "og:image",
      content:
        "https://cdn.hemocione.com.br/events/uploads/1699940076138-logo_hemocione_fb-2(1).png",
    },
    {
      hid: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      hid: "viewport",
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
    },
  ],
});
</script>
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