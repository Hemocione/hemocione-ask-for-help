<template>
  <div class="relative flex-grow mr-2">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Buscar por pedidos disponíveis"
      class="rounded-full p-2 pl-10 w-full bg-[#E8E8E8] focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-[#52575C]"
      @input="handleSearch"
    />
    <span class="absolute left-3 top-2.5 text-gray-400">
      <img
        src="/images/material-symbols_search.svg"
        class="w-5 h-5"
        alt="Ícone de pesquisa"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (event: "update:search", value: string): void;
}>();

const searchQuery = ref<string>("");


const handleSearch = () => {
  emit("update:search", searchQuery.value); 
};
</script>

<style scoped></style>
