import { ref, watch, type Ref } from 'vue'

export function usePersistentState<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue
    ? (JSON.parse(storedValue) as T)
    : defaultValue

  const state = ref<T>(initialValue) as Ref<T>

  watch(state, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  })

  return state
}
