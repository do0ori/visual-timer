import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const uploadSourcemaps = Boolean(sentryAuthToken && sentryOrg && sentryProject);

// https://vitejs.dev/config/
export default defineConfig({
    base: '/visual-timer/',
    plugins: [
        react(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'service-worker.ts',
            registerType: 'autoUpdate',
            injectManifest: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,json}'],
            },
            manifest: {
                name: 'Mellow Visual Timer',
                short_name: 'Visual Timer',
                description: 'A soothing and intuitive visual countdown timer for deep focus, routines, and Pomodoro.',
                theme_color: '#4A7658',
                background_color: '#F4E3C1',
                display: 'standalone',
                orientation: 'any',
                start_url: '/visual-timer/',
                scope: '/visual-timer/',
                icons: [
                    {
                        src: 'favicon.ico',
                        sizes: '64x64 32x32 24x24 16x16',
                        type: 'image/x-icon',
                    },
                    {
                        src: 'icon-192.png',
                        type: 'image/png',
                        sizes: '192x192',
                    },
                    {
                        src: 'logo512.png',
                        type: 'image/png',
                        sizes: '512x512',
                    },
                ],
            },
            devOptions: {
                enabled: true,
                type: 'module',
                navigateFallback: 'index.html',
            },
        }),
        // Only runs in CI, where the Sentry credentials are available.
        uploadSourcemaps &&
            sentryVitePlugin({
                authToken: sentryAuthToken,
                org: sentryOrg,
                project: sentryProject,
                release: { name: `visual-timer@${process.env.npm_package_version}` },
                sourcemaps: { filesToDeleteAfterUpload: ['dist/**/*.map'] },
            }),
    ],
    build: {
        // Generated only when they can be uploaded to Sentry, and deleted from dist
        // afterwards, so source maps are never published to GitHub Pages.
        sourcemap: uploadSourcemaps ? 'hidden' : false,
    },
    server: {
        port: 3000,
        open: false,
    },
});
