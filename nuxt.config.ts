// https://nuxt.com/docs/api/configuration/nuxt-config

const getSiteUrl = () => {
  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === undefined) {
    const nuxtDevConfig = process.env.__NUXT_DEV__;
    let networkAddress;
    if (nuxtDevConfig) {
      const parsedConfig = JSON.parse(nuxtDevConfig);
      networkAddress = parsedConfig?.proxy?.urls?.find(
        (addr: any) => addr.type === "network"
      )?.url;
    }

    return networkAddress || "http://localhost:3000";
  }

  return "https://hemocione-ask-for-help.vercel.app/";
};

const siteUrl = getSiteUrl();

export default defineNuxtConfig({
  devtools: { enabled: true },

  features: {
    inlineStyles: false,
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
    }
  },

  modules: [
    "@pinia/nuxt",
    "@nuxt/image",
    "@element-plus/nuxt",
    "@nuxt/fonts",
    ["@nuxtjs/robots", { configPath: "~/config/robots.config" }],
    "@nuxtjs/seo",
  ],

  routeRules: {
    "/review/:status": {
      ssr: false,
    },
    "/": {
      ssr: false,
      prerender: true,
    },
    "/register": {
      ssr: false,
    },
    "/welcomePage": {
      ssr: false,
    },
  },

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

  site: {
    url: siteUrl,
    indexable: true /* Allow search engines to index the site */,
    name: "Hemocione Pedir Ajuda",
    description:
      "Conecta pessoas que precisam de doações de sangue com doadores",
    defaultLocale: "pt-BR",
    identity: {
      type: "Organization",
    },
    email: "contato@hemocione.com.br",
    twitter: "@hemocione",
    facebook: "hemocione",
    instagram: "@hemocione",
  },

  nitro: {
    compressPublicAssets: true,
  },

  compatibilityDate: "2025-10-03",
});
