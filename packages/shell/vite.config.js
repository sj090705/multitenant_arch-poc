import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// Host app: consumes the three remotes at runtime via Module Federation.
export default defineConfig({
  base: 'http://localhost:5000/',
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        dashboard: 'http://localhost:5001/assets/remoteEntry.js',
        analytics: 'http://localhost:5002/assets/remoteEntry.js',
        settings: 'http://localhost:5003/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
