import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Cho phép dùng tên biến giống Next.js (NEXT_PUBLIC_*) cùng VITE_*
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    react(),
    tailwindcss(),
  ],
  // recharts is a peer of react-is; prebundle must include it so the bare
  // "react-is" import inside the recharts dep chunk resolves in dev.
  optimizeDeps: {
    include: ['recharts', 'react-is'],
  },
})
