import posthog from 'posthog-js'

export default defineNuxtPlugin({
  name: 'posthog',

  async setup(nuxtApp) {
    const { posthog: posthogConfig, NODE_ENV } = useRuntimeConfig().public

    const posthogClient = posthog.init(posthogConfig.publicKey, {
      api_host: posthogConfig.host || 'https://us.i.posthog.com',
      person_profiles: 'always',
      enable_heatmaps: true,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      advanced_disable_feature_flags_on_first_load: true,
      loaded: (posthog) => {
        if (NODE_ENV === 'development') posthog.debug()
      },
    })

    return {
      provide: {
        posthog: () => posthogClient,
      },
    }
  },
})
