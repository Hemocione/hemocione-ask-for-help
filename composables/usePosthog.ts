import type { PostHog } from 'posthog-js'

export function usePosthog() {
  const { $posthog } = useNuxtApp()
  if ($posthog) {
    const posthog = $posthog() as PostHog
    return posthog
  }
  return null
}
