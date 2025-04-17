<template>
  <div></div>
</template>

<script setup lang="ts">
const route = useRoute();
// const router = useRouter();

const id = route.params.id as string;
import type { RequestWithAssisted } from "~/server/services/requestService";
const request = ref<RequestWithAssisted | null>(null);

request.value = await $fetch(`/api/request/${id}`, {
  method: "GET",
});
defineOgImageComponent(
  "RequestDetailsInstagram",
  {
    name: request.value?.assisted.name ?? "",
    bloodType: request.value?.assisted.blood_type ?? "",
    photoURL: request.value?.assisted.photo_url ?? "",
    location: request.value?.local_name ?? "",
  },
  {
    width: 1080,
    height: 1920,
  }
);
</script>