export const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value));
  } else {
    console.warn('localStorage is not available');
  }
}

export const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  console.warn('localStorage is not available');
  return null;
}