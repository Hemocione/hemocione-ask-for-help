import type { CurrentUserData } from "~/utils/userPayloadDecoder";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as CurrentUserData | null,
    token: null as string | null,
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

    clear() {
      this.user = null;
      this.token = null;
    },
  },
});
