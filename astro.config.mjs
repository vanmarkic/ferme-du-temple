import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ferme-du-temple.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Core React - highest priority
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            // Carousel - defer loading
            if (id.includes('embla-carousel')) {
              return 'carousel';
            }
            // Dialog components - defer loading
            if (id.includes('@radix-ui/react-dialog')) {
              return 'dialog';
            }
            // Other UI components - can be deferred
            if (id.includes('@radix-ui/react-slot') || id.includes('@radix-ui/react-toast')) {
              return 'ui-components';
            }
            // Lucide icons - separate chunk
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          },
        },
      },
      cssCodeSplit: true,
      minify: 'esbuild',
    },
  },
});
