import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Horus Seguridad',
        short_name: 'Horus',
        description: 'Sistema de vigilancia ciudadana colaborativa',
        theme_color: '#0f1216',
        icons: [
          {
            src: 'icon-Horus192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-Horus512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})