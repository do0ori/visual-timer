import { TimerSchedule } from './timer-schedule';
import type { WorkerEnv } from './types';

export { TimerSchedule };

const allowedOrigins = new Set(['https://do0ori.github.io', 'http://localhost:3000']);

const corsHeaders = (origin: string | null) => {
    const headers = new Headers();
    if (!origin || !allowedOrigins.has(origin)) return headers;

    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Vary', 'Origin');
    return headers;
};

const withCors = (response: Response, origin: string | null) => {
    const headers = new Headers(response.headers);
    corsHeaders(origin).forEach((value, name) => headers.set(name, value));
    return new Response(response.body, { status: response.status, headers });
};

const scheduleIdFromPath = (pathname: string) => {
    const match = pathname.match(/^\/v1\/schedules\/([\w-]+)$/);
    return match?.[1];
};

export default {
    async fetch(request, env): Promise<Response> {
        const origin = request.headers.get('Origin');
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        const url = new URL(request.url);
        if (request.method === 'GET' && url.pathname === '/v1/push/public-key') {
            return withCors(Response.json({ publicKey: env.VAPID_PUBLIC_KEY }), origin);
        }

        const scheduleId = scheduleIdFromPath(url.pathname);
        if (!scheduleId || !['PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            return withCors(Response.json({ error: 'Not found' }, { status: 404 }), origin);
        }

        const id = env.TIMER_SCHEDULE.idFromName(scheduleId);
        const response = await env.TIMER_SCHEDULE.get(id).fetch(request);
        return withCors(response, origin);
    },
} satisfies ExportedHandler<WorkerEnv>;
