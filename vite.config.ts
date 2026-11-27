import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile(),
      {
        name: 'serve-single-html-download',
        configureServer(server) {
          server.middlewares.use('/kinetilab-laju-reaksi.html', (_req, res, next) => {
            const singleHtmlPath = path.resolve(__dirname, 'dist/index.html');
            if (fs.existsSync(singleHtmlPath)) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.setHeader(
                'Content-Disposition',
                'attachment; filename="kinetilab-laju-reaksi.html"'
              );
              fs.createReadStream(singleHtmlPath).pipe(res);
              return;
            }
            next();
          });
        },
      },
    ],
    build: {
      assetsInlineLimit: 100000000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
