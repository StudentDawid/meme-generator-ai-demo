import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            primary: "#6200EE",
            background: "#0c0a15",
            surface: "#1d1c27",
            "surface-variant": "#2b2839",
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});
