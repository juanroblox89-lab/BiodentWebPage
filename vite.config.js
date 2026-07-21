import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    define: {
      'process.env.NVIDIA_API_KEY': JSON.stringify(env.NVIDIA_API_KEY),
      'import.meta.env.NVIDIA_API_KEY': JSON.stringify(env.NVIDIA_API_KEY)
    }
  }
})

