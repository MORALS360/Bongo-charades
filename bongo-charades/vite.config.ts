import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow any Cloudflare quick-tunnel URL (https), used for real-phone testing.
    // Each `cloudflared tunnel --url` run gets a new random *.trycloudflare.com name.
    allowedHosts: ['.trycloudflare.com'],
  },
})
