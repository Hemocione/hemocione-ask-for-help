<template>
  <div class="flex flex-col items-center justify-center">
    <button
      class="bg-[#E8E8E8] text-white rounded-full px-4 py-2 h-full"
      @click="dialogVisible = true"
    >
      <img src="/public/images/filters.svg" alt="Filtros" />
    </button>

    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      class="absolute top-[29%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md sm:w-[312px] flex flex-col items-center"
    >
      <div class="flex flex-row justify-start items-start w-full gap-5 mb-5">
        <img
          class="w-4 h-4"
          src="/public/images/go-back.svg"
          @click="dialogVisible = false"
        />
        <h2 class="text-[#374957] text-sm">
          Selecione os filtros que deseja aplicar
        </h2>
      </div>
      <p class="text-[#374957]">Tipo Sanguíneo</p>
      <div class="grid grid-cols-4 gap-4 mb-3 p-4">
        <el-button
          v-for="(type, idx) in bloodTypes"
          :key="idx"
          :class="{
            'bg-[#52575C] text-white': selectedBloodTypes.includes(type),
            'hover:text-white text-[#52575C] border border-[#A0A4A8]':
              !selectedBloodTypes.includes(type),
          }"
          @click="toggleBloodTypeSelection(type)"
          size="large"
          type="default"
          class="rounded-lg py-2 font-semibold w-12 h-8 flex items-center justify-center hover:bg-[#A0A4A8]"
        >
          {{ type }}
        </el-button>
      </div>

      <div class="flex justify-end">
        <el-button
          @click="handleViewResults"
          class="bg-[#52575C] p-2 w-full rounded-2xl text-white hover:bg-[#A0A4A8]"
          >Ver Resultados</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElDialog, ElButton } from "element-plus";

const emit = defineEmits<{
  (event: "update:filter", value: string[]): void;
}>();

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

const handleViewResults = () => {
  if (selectedBloodTypes.value.length > 0) {
    emitBloodTypeSelection();
  } else {
    alert("Selecione pelo menos um tipo sanguíneo.");
  }
};
</script>

<style scoped>
button.bg-gray-200 {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 12px;
  background-color: #e8e8e8;
  border: none;
}
</style>
