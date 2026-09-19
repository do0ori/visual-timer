// Runs after `vite build`, which builds the app and then — in vite-plugin-pwa's
// own pass, past every plugin hook — the service worker. Source maps only exist
// so the Sentry plugin can upload them during that build; none may be published
// to GitHub Pages, so drop whatever is left.
import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

const removed = readdirSync(DIST, { recursive: true, encoding: 'utf-8' })
    .filter((entry) => entry.endsWith('.map'))
    .map((entry) => {
        rmSync(join(DIST, entry));
        return entry;
    });

console.log(removed.length ? `Stripped source maps: ${removed.join(', ')}` : 'No source maps to strip.');
