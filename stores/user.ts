import type { CurrentUserData } from "~/utils/userPayloadDecoder";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as CurrentUserData | null,
    token: null as string | null,
    iframed: false as boolean,
    iframeValidated: false as boolean,
  }),

  getters: {
    loggedIn: (state) => Boolean(state.user),
  },

  actions: {
    setUser(user: CurrentUserData | null) {
      if (user) {
        identifyOnPosthog(user);
      }
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
    setIsIframed(value: boolean) {
      this.iframed = value;
      this.iframeValidated = true;
    },

    clear() {
      this.user = null;
      this.token = null;
    },
  },
});
