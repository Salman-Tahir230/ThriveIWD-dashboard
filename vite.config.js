import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Dev-only: runs the Vercel serverless functions in api/ directly inside the
// Vite dev server, so `npm run dev` can hit /api/analytics and /api/leads
// without needing `vercel dev` (which requires a Vercel account login).
function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url.split('?')[0];
        let handlerPath;
        if (path === '/api/analytics') handlerPath = './api/analytics.js';
        else if (path === '/api/leads') handlerPath = './api/leads.js';
        else if (path === '/api/revenue') handlerPath = './api/revenue.js';
        else if (path === '/api/insights') handlerPath = './api/insights.js';
        else return next();

        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        // Vercel auto-parses JSON bodies into req.body; replicate that here for dev.
        if (req.method === 'POST') {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const raw = Buffer.concat(chunks).toString('utf8');
          try {
            req.body = raw ? JSON.parse(raw) : {};
          } catch {
            req.body = {};
          }
        }

        try {
          const mod = await server.ssrLoadModule(handlerPath);
          await mod.default(req, res);
        } catch (err) {
          console.error('[local-api]', err);
          res.status(500).json({ error: err.message });
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);
  return {
    plugins: [react(), localApiPlugin()],
  };
});
