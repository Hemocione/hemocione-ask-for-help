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
          v-for="(person, idx) in requests"
          :key="idx"
          :requesterName="person.assisted.name"
          :requesterLocal="person.local_name"
          :requesterPhoto="person.assisted.photo_url!"
          :bloodType="person.assisted.blood_type"
        />
      </div>
      <div ref="sentinel"></div>
    </div>
    <div class="fixed p-4 bottom-0 left-0 w-full bg-white shadow-lg">
      <ButtonAskForHelp @click="redirect('register')"></ButtonAskForHelp>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RequestWithAssisted } from "~/server/services/requestService";

const router = useRouter();

const redirect = (path: string) => router.push(path);
const mockData = [
  {
    assisted: {
      name: "Rafael Sangue Forte",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pTNgFMam7sm-NMkeVDieflex5poRhb8HgA&s",
      blood_type: "O+",
    },
    local_name: "Hemorio",
  },
  {
    local_name: "Hospital de Câncer",
    assisted: {
      name: "Ana Clara",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTadRXfv3LlFDKspHYPk1qg6DKkxsAyJ4bKyw&s",
      blood_type: "A-",
    },
  },
  {
    local_name: "Hospital São Paulo",
    assisted: {
      name: "Carlos Silva",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGprnRaXZT5yIXWdcja5BIDLRSfsHVPtuqg&s",
      blood_type: "B+",
    },
  },
  {
    local_name: "Hemocentro de Brasília",
    assisted: {
      name: "Mariana Souza",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgJ9S13SnSnlFCruYgeZIVa3U6W0uA8PJV-A&s",
      blood_type: "AB-",
    },
  },
  {
    local_name: "Hospital da Criança",
    assisted: {
      name: "Lucas Pereira",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
      blood_type: "O-",
    },
  },

  {
    local_name: "Hospital da Criança",
    assisted: {
      name: "Lucas Pereira",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
      blood_type: "O-",
    },
  },
  {
    local_name: "Hospital da Criança",
    assisted: {
      name: "Lucas Pereira",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
      blood_type: "O-",
    },
  },
  {
    local_name: "Hospital da Criança",
    assisted: {
      name: "Lucas Pereira",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
      blood_type: "O-",
    },
  },
  {
    local_name: "Hospital da Criança",
    assisted: {
      name: "Lucas Pereira",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
      blood_type: "O-",
    },
  },
  {
    local_name: "Hospital da Criança",
    assisted: {
      name: "Lucas Pereira",
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylKlGcz_m3scQl6_bzjnq3EGjIWeOWJ6rxw&s",
      blood_type: "O-",
    },
  },
] as any[];

const requests = ref<RequestWithAssisted[]>(mockData);
const page = ref(1);
const sentinel = ref<HTMLDivElement | null>(null);
const LIMIT_PAGE = 10;

onMounted(async () => {
  await fetchMore();
  if (sentinel.value) {
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        await fetchMore();
      }
    });

    observer.observe(sentinel.value);
  }
});

const fetchMore = async () => {
  const fetchedData: RequestWithAssisted[] = await $fetch("/api/requests", {
    method: "GET",
    params: { page: page.value, per_page: LIMIT_PAGE },
  });

  page.value++;
  requests.value = [...requests.value, ...fetchedData];
};
</script>
