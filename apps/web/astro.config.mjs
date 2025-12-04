import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import { execSync } from 'child_process';

const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';

// Get git version for footer display
const getGitVersion = () => {
  try {
    return execSync('git describe --tags --always 2>/dev/null || git rev-parse --short HEAD')
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
};
const APP_VERSION = getGitVersion();

export default defineConfig({
  site: 'https://lafermedutemple.be',
  output: 'server', // Enable SSR for admin routes
  // Use Node.js adapter in dev for Keystatic local mode, Vercel in production
  adapter: isDev ? node({ mode: 'standalone' }) : vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
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
    define: {
      __APP_VERSION__: JSON.stringify(APP_VERSION),
    },
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
