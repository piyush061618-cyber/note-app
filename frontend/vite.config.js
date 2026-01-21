// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
//   server:{
//     proxy:{
//       "/api": {
//          target: "http://localhost:5000 "
        
//       }
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

<<<<<<< HEAD
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
=======
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // No server proxy needed for Vercel deployment
>>>>>>> 41a2c70376d736d20e3e6a586040113f4ea20cbb
})

