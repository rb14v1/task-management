import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const healthzPlugin = {
  name: 'healthz',
  configureServer(server: { middlewares: { use: (path: string, handler: (req: unknown, res: { setHeader: (k: string, v: string) => void; statusCode: number; end: (body: string) => void }) => void) => void } }) {
    server.middlewares.use('/healthz', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'ok' }));
    });
  },
  configurePreviewServer(server: { middlewares: { use: (path: string, handler: (req: unknown, res: { setHeader: (k: string, v: string) => void; statusCode: number; end: (body: string) => void }) => void) => void } }) {
    server.middlewares.use('/healthz', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'ok' }));
    });
  },
};

export default defineConfig({
  plugins: [react(), healthzPlugin],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});