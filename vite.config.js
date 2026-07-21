import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const nvidiaKey = process.env.VITE_NVIDIA_API_KEY || process.env.NVIDIA_API_KEY || env.VITE_NVIDIA_API_KEY || env.NVIDIA_API_KEY || ''

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    define: {
      'import.meta.env.VITE_NVIDIA_API_KEY': JSON.stringify(nvidiaKey),
      'import.meta.env.NVIDIA_API_KEY': JSON.stringify(nvidiaKey),
      'process.env.NVIDIA_API_KEY': JSON.stringify(nvidiaKey),
      'process.env.VITE_NVIDIA_API_KEY': JSON.stringify(nvidiaKey)
    }
  }
})


