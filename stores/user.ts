export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any | null, // TODO: type correctly
    token: null as string | null,
  }),
  getters: {
    loggedIn: (state) => Boolean(state.user),
  },
  actions: {
    setUser(user: any | null) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
  },
});
