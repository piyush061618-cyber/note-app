import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:{
    proxy:{
      "/api": {
<<<<<<< HEAD
         target: "http://localhost:5000 ",
=======
         target: "https://note-app-hl37.onrender.com/"
>>>>>>> 462c57c095184f57169822c5d9a300adc314d436
      }
    }
  }
})
