import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Assets are served from wp-content/plugins/nbp-exr/public/, so every URL must be relative.
  base: './',
  // public/ is the build output, not a static assets folder.
  publicDir: false,
  plugins: [
    vue(),
    // Imports only the Element Plus components (and their CSS) that are actually used.
    Components({
      dirs: [],
      dts: 'src/components.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'public',
    emptyOutDir: true,
    // Read by includes/Assets.php to register scripts and styles.
    manifest: 'manifest.json',
    target: 'es2020',
    rollupOptions: {
      input: {
        frontend: 'src/frontend/main.ts',
        admin: 'src/admin/main.ts',
      },
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/shared-[hash].js',
        assetFileNames: 'assets/[hash][extname]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/js/**/*.spec.ts'],
    // Element Plus component styles are imported as CSS; let Vite process them.
    server: { deps: { inline: ['element-plus'] } },
  },
})
