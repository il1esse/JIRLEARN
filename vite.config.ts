import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // data/postgres = fichiers du conteneur Postgres (WAL, checkpoints) écrits en
      // continu ; server/ = backend Express, processus séparé avec son propre watcher.
      // Sans cette exclusion, chaque écriture DB fait déclencher un full-reload Vite.
      ignored: ["**/data/**", "**/server/**"],
    },
  },
})
