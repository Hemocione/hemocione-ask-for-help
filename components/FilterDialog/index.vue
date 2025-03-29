<template>
  <div class="flex flex-col items-center justify-center">
    <img @click="dialogVisible = true" :src="filterIcon" alt="Filtros" />

    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      :align-center="true"
      class="bg-[--black-5] border border-[--black-80] p-4 rounded-lg !w-[312px] flex flex-col items-center"
    >
      <div class="flex flex-row justify-start items-start w-full gap-5 mb-5">
        <img
          class="w-4 h-4"
          src="/public/images/go-back.svg"
          @click="dialogVisible = false"
          alt="Setinha para voltar pra página anterior"
        />
        <h2 class="text-[--black-80] text-sm">
          Selecione os filtros que deseja aplicar
        </h2>
      </div>
      <p class="text-[--black-80]">Tipo Sanguíneo</p>
      <div class="grid grid-cols-4 gap-4 mb-3 p-4">
        <el-button
          v-for="(type, idx) in bloodTypes"
          :key="idx"
          :class="{
            'bg-[--hemo-color-primary] text-[--black-0]': selectedBloodTypes.includes(type),
            ' text-[--black-80] border border-[--black-60]':
              !selectedBloodTypes.includes(type),
          }"
          @click="toggleBloodTypeSelection(type)"
          size="large"
          type="default"
          class="rounded-lg py-2 w-12 h-8 flex items-center justify-center"
        >
          {{ type }}
        </el-button>
      </div>

      <div class="flex justify-end">
        <el-button
          @click="emitBloodTypeSelection"
          class="bg-[--hemo-color-primary] p-2 w-full rounded-2xl text-[--hemo-color-text-primary] hover:bg-red-500"
          >Ver Resultados</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElButton } from "element-plus";
import { bloodTypes } from "~/types/blood";

const emit = defineEmits<{
  (event: "update:filter", value: string[]): void;
}>();

const dialogVisible = ref(false);
const selectedBloodTypes = ref<string[]>([]);

const emitBloodTypeSelection = () => {
  dialogVisible.value = false;
  emit("update:filter", selectedBloodTypes.value);
};

const toggleBloodTypeSelection = (type: string) => {
  if (selectedBloodTypes.value.includes(type)) {
    selectedBloodTypes.value = selectedBloodTypes.value.filter(
      (t) => t !== type
    );
  } else {
    selectedBloodTypes.value.push(type);
  }
};

const filterIcon = computed(() =>
  selectedBloodTypes.value.length
    ? "/images/active_filter.png"
    : "/images/inactive_filter.png"
);
</script>

<style scoped>
button.bg-gray-200 {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 12px;
  background-color: var(--black-10);
  border: none;
}
</style>
