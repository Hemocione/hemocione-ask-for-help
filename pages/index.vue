<template>
  <div class="flex flex-col items-center justify-between w-full h-screen">
    <div class="flex-grow w-full pb-20">
      <div class="flex flex-row justify-between items-center w-full p-4">
        <SearchBar @update:search="onSearch" />
        <FilterDialog @update:filter="onFilter" />
      </div>
      <Transition name="fade" mode="out-in">
        <div v-if="fetching && !alreadyFetched" class="flex flex-col gap-4 w-full p-4">
          <SkeletonCardRequest v-for="i in 3" :key="i" />
        </div>
        <div v-else-if="resultsNotFound" class="flex flex-col items-center gap-4 w-full">
          <h2>Nenhum pedido encontrado :(</h2>
          <img
            src="/images/rafiki.svg"
            alt="Imagem ilustrativa de uma pessoa doando sangue"
            class="w-[250px] mx-auto"
          />
        </div>
        <div v-else class="flex flex-col gap-4 w-full p-4">
          <CardRequest
            v-for="(person, idx) in requests"
            :key="person.id"
            :requesterName="person.assisted.name"
            :requesterLocal="person.local_name"
            :requesterPhoto="person.assisted.photo_url!"
            :bloodType="person.assisted.blood_type"
            class="cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg motion-safe:animate-fade-in motion-safe:animate-slide-up"
            :style="{
              '--tw-animate-delay': `${idx * 50}ms`
            }"
            @click="redirect(`description/${person.id}`)"
          />
        </div>
      </Transition>
      <div ref="sentinel" class="px-4">
        <SkeletonCardRequest v-if="fetching && alreadyFetched" />
      </div>
    </div>
    <div
      class="sticky p-4 bottom-0 left-0 w-full bg-white shadow-lg rounded-t-3xl border-2 border[--black-20]"
    >
      <ButtonAskForHelp @click="redirect('register')"></ButtonAskForHelp>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { debounce } from "lodash-es";
import type { RequestWithAssisted } from "~/server/services/requestService";

const router = useRouter();
const posthog = usePosthog();

const redirect = (path: string) => {
  posthog?.capture("click_pedir_ajuda");
  router.push(`/${path}`);
};

const requests = ref<RequestWithAssisted[]>([]);
const page = ref(1);
const hasMore = ref(true);
const sentinel = ref<HTMLDivElement | null>(null);
const LIMIT_PAGE = 10;
const fetching = ref(true);
const alreadyFetched = ref(false);
const minLoadingTime = 1000; // 1 second in milliseconds
let loadingStartTime: number;

const query = ref<{
  name?: string;
  bloodTypes?: string[];
}>({
  name: undefined,
  bloodTypes: undefined,
});

// Função chamada ao buscar dados no servidor
const fetchRequests = async () => {
  try {
    if (!hasMore.value) return;

    fetching.value = true;
    loadingStartTime = Date.now();
    const params = { ...query.value, page: page.value, per_page: LIMIT_PAGE };

    const fetchedData: RequestWithAssisted[] = await $fetch("/api/requests", {
      method: "GET",
      params,
    });

    if (fetchedData.length < LIMIT_PAGE) {
      hasMore.value = false;
    }

    page.value++;
    if (page.value === 1) {
      requests.value = fetchedData;
    } else {
      requests.value = [...requests.value, ...fetchedData];
    }
  } finally {
    const elapsedTime = Date.now() - loadingStartTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
    
    // Ensure minimum loading time
    await new Promise(resolve => setTimeout(resolve, remainingTime));
    
    fetching.value = false;
    alreadyFetched.value = true;
  }
};

// Função para resetar paginação ao alterar filtros ou busca
const resetAndFetch = () => {
  page.value = 1;
  hasMore.value = true;
  requests.value = [];

  fetchRequests();
};

// Debounce para busca
const debouncedSearch = debounce((searchTerm: string) => {
  query.value.name = searchTerm;
  resetAndFetch();
}, 300);

const onSearch = (searchTerm: string) => {
  debouncedSearch(searchTerm);
};

const onFilter = (bloodTypes: string[]) => {
  query.value.bloodTypes = bloodTypes;
  alreadyFetched.value = false;
  resetAndFetch();
};

const resultsNotFound = computed(() => {
  return alreadyFetched.value && !requests.value.length && !fetching.value;
});

onMounted(() => {
  if (sentinel.value) {
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        await fetchRequests();
      }
    });

    observer.observe(sentinel.value);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
