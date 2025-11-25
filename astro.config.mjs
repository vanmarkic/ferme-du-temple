import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://lafermedutemple.be',
  output: 'server', // Enable SSR for admin routes
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    keystatic(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-BE',
        },
      },
    }),
  ],
  prefetch: {
    prefetchAll: false, // Only prefetch what we explicitly mark
    defaultStrategy: 'viewport', // Prefetch when in viewport
  },
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
            // Core React + critical utils - highest priority, bundle together
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            // Bundle critical className utilities with React to avoid dependency chain
            if (id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'react-vendor';
            }
            // CRITICAL: Bundle carousel with react-vendor to eliminate waterfall
            // This increases the initial bundle slightly but removes the 1.3s delay
            if (id.includes('embla-carousel')) {
              return 'react-vendor';
            }
            // Dialog components - lazy loaded on click, keep separate
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
            // Supabase - separate chunk for form only
            if (id.includes('@supabase/')) {
              return 'supabase';
            }
            // React Query - separate chunk for form only
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            // Leaflet - separate chunk for map only
            if (id.includes('leaflet')) {
              return 'leaflet';
            }
          },
        },
      },
      cssCodeSplit: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 600,
      modulePreload: {
        polyfill: true, // Enable module preload for better loading
      },
    },
  },
});
