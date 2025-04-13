import type { LocationQuery } from "#vue-router";
import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const isLoggedIn = await evaluateCurrentLogin(from.query);
  if (!isLoggedIn) {
    await redirectToID(to.fullPath);
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url.toString());
});

export async function evaluateCurrentLogin(query?: LocationQuery) {
  const { user, setUser, setToken, clear } = useUserStore();
  const config = useRuntimeConfig();

  if (user) return true;

  const token = getCurrentToken(query);

  if (!token) return false;
  let tokenIsValid = true;

  try {
    await useFetch(`${config.public.hemocioneIdApiUrl}/users/validate-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onRequestError: (_error) => {
        tokenIsValid = false;
      },
      onResponseError: (_error) => {
        tokenIsValid = false;
      },
    });
  } catch (error) {
    tokenIsValid = false;
  }

  if (!tokenIsValid) {
    clear();
    return false;
  }

  const currentUser = currentUserTokenDecoder(token);

  if (!currentUser) {
    return false;
  }

  setUser(currentUser);
  setToken(token);

  const tokenCookie = useCookie(config.public.authCookieKey, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  tokenCookie.value = token;

  return true;
}

export function getCurrentToken(query?: LocationQuery): string | null {
  if (query?.token) {
    return String(query.token);
  }

  const { token } = useUserStore();
  if (token) {
    return token;
  }

  const config = useRuntimeConfig();
  const tokenCookie = useCookie(config.public.authCookieKey, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return tokenCookie.value || null;
}

export function redirectToID(fullPath: string) {
  const redirectUrl = `${window.location.origin}${fullPath}`;
  return navigateTo(getHemocioneIdUrl(redirectUrl), { external: true });
}
