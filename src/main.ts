import * as Fathom from "fathom-client"
import { createApp } from "vue"

import App from "./App.vue"

import "modern-normalize"

void (async () => {
  const Sentry = await import(/* chunkname: "test" */ "@sentry/vue")

  const app = createApp(App)

  Sentry.init({
    enabled: import.meta.env.PROD && !!import.meta.env.VITE_SENTRY_DSN,
    dsn: import.meta.env.VITE_SENTRY_DSN as string | undefined,
    environment: import.meta.env.VITE_VERCEL_MODE as string,
  })

  app.config.errorHandler = (error, _, info) => {
    Sentry.setTag("info", info)
    Sentry.captureException(error)
  }

  Fathom.load(import.meta.env.VITE_FATHOM_SITE_ID as string, {
    url: "https://mammal.haglund.dev/script.js",
    spa: "auto",
  })

  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" })
    })
  }

  app.mount("#app")
})()
