import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { pathToFileURL } from 'url'

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

// Serves API endpoints locally inside Vite dev server so `npm run dev` works without vercel CLI
function devApiPlugin(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (!url.startsWith('/api/')) {
          return next()
        }

        // Expose env vars to the handler
        if (env.NVIDIA_API_KEY) process.env.NVIDIA_API_KEY = env.NVIDIA_API_KEY
        if (env.MONGODB_URI) process.env.MONGODB_URI = env.MONGODB_URI
        if (env.JWT_SECRET) process.env.JWT_SECRET = env.JWT_SECRET

        // Match endpoint
        let relativeHandler = ''
        if (url.startsWith('/api/chat')) {
          relativeHandler = 'api/chat.js'
        } else if (url.startsWith('/api/admin-auth')) {
          relativeHandler = 'api/admin-auth.js'
        } else if (url.startsWith('/api/admin-conversations')) {
          relativeHandler = 'api/admin-conversations.js'
        } else {
          return next()
        }

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
          res.end()
          return
        }

        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          try {
            if (body) {
              try {
                req.body = JSON.parse(body)
              } catch {
                req.body = {}
              }
            } else {
              req.body = {}
            }

            const absolutePath = path.resolve(process.cwd(), relativeHandler)
            const fileUrl = pathToFileURL(absolutePath).href
            const { default: handler } = await import(fileUrl)
            await handler(req, res)
          } catch (err) {
            console.error('[dev-api] Error handling ' + url + ':', err.message)
            if (!res.headersSent) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Dev server error: ' + err.message }))
            }
          }
        })
      })
    },
  }
}
