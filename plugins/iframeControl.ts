import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  // app:beforeMount (não app:mounted) — precisa rodar ANTES do primeiro
  // paint, senão o header pisca visível por um instante (iframed começa
  // false no store) antes de sumir.
  nuxtApp.hook("app:beforeMount", async () => {
    const userStore = useUserStore();
    userStore.setIsIframed(window !== window.top);
  });
});
