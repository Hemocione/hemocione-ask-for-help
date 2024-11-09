<template>
  <div class="p-4 flex flex-col h-screen w-full gap-4 items-center">
    <div class="flex flex-row justify-start items-start w-full p-4">
      <img
        class="w-6 h-6"
        src="/public/images/go-back.svg"
        @click="$router.back()"
      />
    </div>

    <div
      class="w-28 h-28 bg-[#CD6D71] rounded-full flex items-center justify-center"
    >
      <img
        src="/public/images/gallery.svg"
        class="w-10 h-10"
        alt="Ícone de coração"
      />
    </div>

    <div class="w-full">
      <label>Nome</label><span class="text-red-500">*</span>
      <ElInput class="input" placeholder="Insira o nome completo"></ElInput>
    </div>

    <div class="w-full">
      <label>Documentação de identificação</label
      ><span class="text-red-500">*</span>
      <ElInput class="input" placeholder="Insira o número de CPF"></ElInput>
    </div>

    <div class="w-full">
      <label>Local para doação</label><span class="text-red-500">*</span>
      <ElInput
        class="input"
        placeholder="Insira Hospital ou Instituição"
      ></ElInput>
    </div>

    <div class="fixed p-4 bottom-0 left-0 w-full bg-white shadow-lg">
      <Button>Continuar</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
</script>

<style scoped>
.input {
  @apply h-14;
}
</style>
