import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ ones) for the dev API middleware
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      devApiPlugin(env),
    ],
  }
})

// Serves api/chat.js inside Vite's dev server so `npm run dev` works without vercel CLI
function devApiPlugin(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res, next) => {
        // Expose env vars to the handler (process.env is shared in Node.js)
        if (env.NVIDIA_API_KEY) process.env.NVIDIA_API_KEY = env.NVIDIA_API_KEY

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          try {
            req.body = JSON.parse(body || '{}')
            // Dynamic import so the handler picks up the latest env vars
            const { default: handler } = await import('./api/chat.js')
            await handler(req, res)
          } catch (err) {
            console.error('[dev-api] Error:', err.message)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Dev server error: ' + err.message }))
          }
        })
      })
    },
  }
}
