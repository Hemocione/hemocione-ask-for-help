<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex-grow w-full pb-20">
      <div class="flex flex-row justify-between items-center w-full p-4">
        <SearchBar />
        <FilterDialog />
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
      <ButtonAskForHelp>
        <img
          src="/public/images/gotinha.svg"
          class="w-6 h-6"
          alt="Ícone de coração"
        />
        <h4 class="font-semibold">Pedir ajuda</h4></ButtonAskForHelp
      >
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

  {
    requesterName: "Lucas Pereira",
    requesterLocal: "Hospital da Criança",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
    bloodType: "O-",
  },
  {
    requesterName: "Lucas Pereira",
    requesterLocal: "Hospital da Criança",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
    bloodType: "O-",
  },
  {
    requesterName: "Lucas Pereira",
    requesterLocal: "Hospital da Criança",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
    bloodType: "O-",
  },
  {
    requesterName: "Lucas Pereira",
    requesterLocal: "Hospital da Criança",
    requesterPhoto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
    bloodType: "O-",
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
