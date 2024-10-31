<template>
  <div class="flex flex-col items-center justify-center h-screen w-full">
    <div class="flex-grow w-full">
      <div class="flex flex-row justify-between items-center w-full p-4">
        <div class="relative flex-grow mr-2">
          <input
            type="text"
            placeholder="Buscar por pedidos disponíveis"
            class="rounded-full p-2 pl-10 w-full bg-[#E8E8E8] focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-[#52575C]"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <img
              src="/public/images/material-symbols_search.svg"
              class="w-5 h-5"
              alt="Ícone de pesquisa"
            />
          </span>
        </div>
        <button class="bg-[#E8E8E8] text-white rounded-full px-4 py-2 h-full">
          <img src="/public/images/filters.svg" />
        </button>
      </div>
      <!-- Card requests paginated list -->
      <div class="flex flex-col gap-4 w-full p-4">
        <CardRequest
          v-for="(person, idx) in mockData"
          :key="idx"
          :requesterName="person.requesterName"
          :requesterLocal="person.requesterLocal"
          :requesterPhoto="person.requesterPhoto"
          :bloodType="person.bloodType"
        />
      </div>
    </div>
    <div class="fixed p-4 bottom-0 left-0 w-full bg-white shadow-lg">
      <button
        class="w-full py-3 rounded-2xl text-white bg-[#BB0A08] hover:bg-red-600 focus:outline-none flex items-center justify-center gap-2"
      >
        <img
          src="/public/images/gotinha.svg"
          class="w-6 h-6"
          alt="Ícone de coração"
        />
        <h4 class="font-semibold">Pedir ajuda</h4>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const mockData = [
  {
    requesterName: "Rafael Sangue Forte",
    requesterLocal: "Hemorio",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pTNgFMam7sm-NMkeVDieflex5poRhb8HgA&s",
    bloodType: "O+",
  },
  {
    requesterName: "Ana Clara",
    requesterLocal: "Hospital de Câncer",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTadRXfv3LlFDKspHYPk1qg6DKkxsAyJ4bKyw&s",
    bloodType: "A-",
  },
  {
    requesterName: "Carlos Silva",
    requesterLocal: "Hospital São Paulo",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGprnRaXZT5yIXWdcja5BIDLRSfsHVPtuqg&s",
    bloodType: "B+",
  },
  {
    requesterName: "Mariana Souza",
    requesterLocal: "Hemocentro de Brasília",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgJ9S13SnSnlFCruYgeZIVa3U6W0uA8PJV-A&s",
    bloodType: "AB-",
  },
  {
    requesterName: "Lucas Pereira",
    requesterLocal: "Hospital da Criança",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
    bloodType: "O-",
  },
];
</script>
