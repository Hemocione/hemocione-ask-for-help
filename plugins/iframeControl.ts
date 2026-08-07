import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", async () => {
    const userStore = useUserStore();
    userStore.setIsIframed(window !== window.top);
  });
});
