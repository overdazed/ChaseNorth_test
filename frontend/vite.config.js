import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   server: {
//     host: true,
//     port: 5173, // dev server port
//     strictPort: true,
//     proxy: {
//       // This will proxy all API requests to your backend
//       '/api': {
//         target: import.meta.env.VITE_API_URL || 'https://api.chasenorth.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//         secure: false,
//       }
//     }
//   },
//   preview: {
//     port: 4173, // production preview port
//     host: true,
//     allowedHosts: ['chasenorth.com', 'api.chasenorth.com'], // important for tunnel
//   },
// })


// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'node:querystring': 'querystring-es3'
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: ['chasenorth.com', 'localhost', '127.0.0.1'], // <-- add here
      proxy: {
        // This will proxy all API requests to your backend
        '/api': {
          target: env.VITE_API_URL || 'https://api.chasenorth.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        }
      }
    },
    preview: {
      port: 4173,
      host: true,
      //allowedHosts: ['chasenorth.com', 'api.chasenorth.com'],
      allowedHosts: ['chasenorth.com'],
    },
  }
})
