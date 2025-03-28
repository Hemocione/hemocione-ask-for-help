export const setLocalStorage = (key: string, value: any) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key: string) => {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
