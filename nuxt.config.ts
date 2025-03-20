// https://nuxt.com/docs/api/configuration/nuxt-config

const getSiteUrl = () => {
  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === undefined) {
    return "http://localhost:3000";
  }

  return "https://hemocione-ask-for-help.vercel.app/";
};

const siteUrl = getSiteUrl();

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  features: {
    inlineStyles: false,
  },

  routeRules: {
    // prerender index route by default
    "/": { prerender: true },
  },

  css: [
    "~/assets/css/main.css",
    "~/assets/css/transitions.css",
    "~/assets/css/animations.css",
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    pageTransition: {
      name: "slide-left",
      mode: "out-in",
      appear: true,
    },
    layoutTransition: {
      name: "slide-left",
      mode: "out-in",
    },
    head: {
      title: "Hemocione - Pedir ajuda",
      htmlAttrs: {
        lang: "pt-BR",
      },
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Aplicativo para conectar pessoas que precisam de doações de sangue com doadores",
        },
        {
          hid: "og:description",
          property: "og:description",
          content:
            "Aplicativo para conectar pessoas que precisam de doações de sangue com doadores",
        },
        {
          hid: "og:image",
          property: "og:image",
          content:
            "https://cdn.hemocione.com.br/events/uploads/1699940076138-logo_hemocione_fb-2(1).png",
        },
        {
          hid: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          hid: "viewport",
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
        },
      ],
    },
  },

  modules: [
    "@pinia/nuxt",
    "@nuxt/image",
    "@element-plus/nuxt",
    "@nuxt/fonts",
    ["@nuxtjs/robots", { configPath: "~/config/robots.config" }],
  ],

  site: { indexable: true },

  runtimeConfig: {
    public: {
      authCookieKey: process.env.HEMOCIONE_AUTH_COOKIE_KEY ?? "hemocioneId",
      hemocioneIdUrl:
        process.env.HEMOCIONE_ID_URL ?? "https://id.d.hemocione.com.br",
      hemocioneIdApiUrl:
        process.env.HEMOCIONE_ID_API_URL ??
        "https://hemocione-id-dev.cpt.hemocione.com.br",
      cdnUploadUrl:
        process.env.CDN_UPLOAD_URL ?? "http://localhost:3001/api/upload",
      instagramUrl:
        process.env.INSTAGRAM_URL ?? "https://www.instagram.com/hemocione/",
      siteUrl,
    },
    hemocioneIdIntegrationSecret:
      process.env.HEMOCIONE_ID_INTEGRATION_SECRET ?? "secret",
    hemocioneIdJwtSecretKey:
      process.env.HEMOCIONE_ID_JWT_SECRET_KEY ?? "hemocione",
    secret: process.env.API_SECRET ?? "secret",
  },

  nitro: {
    compressPublicAssets: true,
  },
  compatibilityDate: "2024-10-01",
});
