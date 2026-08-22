# Reliable Background Timer Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reliably notify a user when a timer ends while the PWA is backgrounded or closed, without relying on browser timer execution.

**Architecture:** The React PWA owns foreground rendering from an absolute `endAt` timestamp. A Cloudflare Worker and one SQLite-backed Durable Object per schedule own the durable deadline and send one VAPID-authenticated Web Push completion notification. The existing service worker becomes a Push notification renderer and client-navigation bridge, not a scheduler.

**Tech Stack:** React 18, TypeScript, Zustand, Vite PWA/Workbox, Cloudflare Workers, Durable Objects, Web Push/VAPID.

**Spec:** `docs/superpowers/specs/2026-08-22-reliable-background-timer-notifications-design.md`

## Global Constraints

- Keep the React app deployed on GitHub Pages at `https://do0ori.github.io/visual-timer`.
- Use Cloudflare Worker secrets for VAPID private material; never commit secrets.
- Support Web Push progressively; foreground timers remain usable without Push support or permission.
- Do not claim custom uploaded audio plays while the app is hidden or closed.
- Use `endAt` as the sole clock source outside visible rendering.

---

### Task 1: Create and test the Cloudflare scheduling service

**Files:**

- Create: `workers/timer-notifications/src/index.ts`
- Create: `workers/timer-notifications/src/timer-schedule.ts`
- Create: `workers/timer-notifications/src/types.ts`
- Create: `workers/timer-notifications/wrangler.jsonc`
- Create: `workers/timer-notifications/package.json`
- Create: `workers/timer-notifications/test/timer-schedule.test.ts`

**Interfaces:**

- Produces `TimerSchedule` Durable Object with `fetch()` routes for create, lease refresh, cancellation, and `alarm()` delivery.
- Produces worker routes `GET /v1/push/public-key` and `/v1/schedules/:id`.

- [ ] **Step 1: Write failing Durable Object tests**

Test creation schedules an alarm at `endAt`, cancellation deletes the alarm, a valid visible lease defers completion by five seconds, and an expired lease sends one Push payload.

- [ ] **Step 2: Run the Worker test command and verify expected failures**

Run: `npm test --workspace workers/timer-notifications`

Expected: failing imports because `TimerSchedule` and routes do not exist.

- [ ] **Step 3: Implement the minimal durable schedule**

Create `TimerSchedule` with SQLite-backed state `{ capability, endAt, title, deepLink, subscription, visibleUntil, status }`. Validate a future `endAt` no more than 24 hours away. Call `this.ctx.storage.setAlarm(endAt)`. In `alarm()`, defer five seconds while `visibleUntil > Date.now()`; otherwise atomically mark the schedule delivered, send its encrypted Push, and remove invalid subscriptions for HTTP 404/410 responses.

- [ ] **Step 4: Add worker routing and CORS**

Route exact production and localhost origins only. Bind `TIMER_SCHEDULE` Durable Object. Return the public VAPID key without exposing private credentials. Require matching capability tokens for `PUT`, `PATCH`, and `DELETE` operations.

- [ ] **Step 5: Run the Worker tests and typecheck**

Run: `npm test --workspace workers/timer-notifications && npm run typecheck --workspace workers/timer-notifications`

Expected: all schedule state, cancellation, lease, and invalid-subscription cases pass.

- [ ] **Step 6: Commit**

```bash
git add workers/timer-notifications
git commit -m "feat: Add durable timer push scheduling"
```

### Task 2: Add browser Push subscription and schedule client

**Files:**

- Create: `src/services/timerNotificationService.ts`
- Create: `src/services/timerNotificationService.test.ts`
- Modify: `src/store/settingsStore.ts`
- Modify: `src/index.tsx`

**Interfaces:**

- Consumes `GET /v1/push/public-key` and schedule mutation routes from Task 1.
- Produces `ensurePushSubscription()`, `scheduleTimer()`, `renewVisibleLease()`, and `cancelTimerSchedule()`.

- [ ] **Step 1: Write failing client service tests**

Verify URL-safe VAPID public-key conversion, unsupported API handling, a user-initiated permission request, subscription serialization, and cancellation requests containing schedule ID plus capability.

- [ ] **Step 2: Run the client test and verify expected failures**

Run: `npm.cmd test -- --runTestsByPath src/services/timerNotificationService.test.ts`

Expected: failing import because the notification service does not exist.

- [ ] **Step 3: Implement the client service**

Wait for `navigator.serviceWorker.ready`, request permission only from the explicit settings action, call `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`, persist the opaque schedule credentials locally, and call the Worker API with `fetch` plus the production API base URL from `VITE_TIMER_NOTIFICATION_API_URL`.

- [ ] **Step 4: Add persisted notification capability state**

Extend settings with permission/support status only. Do not persist the Push endpoint in Zustand; retrieve current browser subscription through `pushManager.getSubscription()` when scheduling.

- [ ] **Step 5: Run service tests and the existing suite**

Run: `npm.cmd test -- --runTestsByPath src/services/timerNotificationService.test.ts && npm.cmd test`

Expected: client service tests and all existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/services src/store/settingsStore.ts src/index.tsx
git commit -m "feat: Add browser push scheduling client"
```

### Task 3: Convert timer state to absolute deadline reconciliation

**Files:**

- Modify: `src/hooks/useTimer.ts`
- Create: `src/hooks/useTimer.test.ts`
- Modify: `src/utils/timerHandler.ts`

**Interfaces:**

- Consumes `scheduleTimer`, `renewVisibleLease`, and `cancelTimerSchedule` from Task 2.
- Produces timer controller behavior derived from `endAt` while running.

- [ ] **Step 1: Write failing timer tests**

Test that hidden-to-visible reconciliation derives remaining count from an `endAt` timestamp, a completed deadline calls `onFinish` once, and pause/reset cancels the associated remote schedule.

- [ ] **Step 2: Run the hook test and verify expected failures**

Run: `npm.cmd test -- --runTestsByPath src/hooks/useTimer.test.ts`

Expected: failures because the hook still stores elapsed interval state and posts direct service-worker timer commands.

- [ ] **Step 3: Implement absolute-deadline behavior**

Set `endAt` when `start()` runs. While visible, calculate `count` from `Math.ceil((endAt - Date.now()) / intervalMs)`. On hidden, schedule the remote deadline and show a running-status notification. On visible, close the running-status notification, reconcile count from `endAt`, and renew a visible lease every five seconds. Cancel the remote schedule on pause, reset, input changes, and completion.

- [ ] **Step 4: Preserve exactly-once completion behavior**

Retain `finishTriggeredRef`; after reconciliation reaches zero, invoke `onFinish` once, cancel the schedule, and leave existing foreground audio/modal behavior in `timerHandler.ts` intact.

- [ ] **Step 5: Run hook tests and the full application suite**

Run: `npm.cmd test -- --runTestsByPath src/hooks/useTimer.test.ts && npm.cmd test`

Expected: deadline, visibility, and cancellation regressions pass; existing tests remain green.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useTimer.ts src/hooks/useTimer.test.ts src/utils/timerHandler.ts
git commit -m "fix: Reconcile timers from absolute deadlines"
```

### Task 4: Render Push and running-status notifications in the service worker

**Files:**

- Modify: `src/service-worker.ts`
- Create: `src/service-worker.test.ts`

**Interfaces:**

- Consumes `timer-finished` Push payloads from Task 1.
- Consumes `show-running-status` and `clear-running-status` messages from Task 3.
- Produces one tagged running-status notification and one tagged completion notification per schedule.

- [ ] **Step 1: Write failing service-worker tests**

Test that a `timer-finished` Push event calls `showNotification()` with `tag: timerId`, completion body, timestamp, and deep-link data; test that visible-status clear messages close only their matching tag.

- [ ] **Step 2: Run the service-worker test and verify expected failures**

Run: `npm.cmd test -- --runTestsByPath src/service-worker.test.ts`

Expected: failures because the worker currently depends on in-memory interval handles rather than Push payloads.

- [ ] **Step 3: Replace in-memory scheduler logic**

Remove `activeTimers`, `setTimeout`, and `setInterval`. Add a `push` listener that parses the completion payload and wraps `showNotification()` in `event.waitUntil()`. Keep notification click behavior, carrying `deepLink` in notification data. Add message handlers that render or close the single running-status notification.

- [ ] **Step 4: Run service-worker and full tests, then build**

Run: `npm.cmd test && npm.cmd run build`

Expected: all tests pass and the PWA worker builds successfully.

- [ ] **Step 5: Commit**

```bash
git add src/service-worker.ts src/service-worker.test.ts
git commit -m "feat: Handle timer push notifications"
```

### Task 5: Add user-facing notification controls and platform guidance

**Files:**

- Modify: `src/components/settings/sections/AlarmSettings.tsx`
- Create: `src/components/settings/sections/AlarmSettings.test.tsx`
- Modify: `README.md`

**Interfaces:**

- Consumes notification support and permission state from Task 2.
- Produces an explicit “Enable background alerts” action and platform-specific status text.

- [ ] **Step 1: Write failing settings tests**

Test that the enable action appears when permission is `default`, shows an enabled state for `granted`, and displays iOS Home Screen installation guidance when Push APIs are unavailable.

- [ ] **Step 2: Run the settings test and verify expected failures**

Run: `npm.cmd test -- --runTestsByPath src/components/settings/sections/AlarmSettings.test.tsx`

Expected: failures because no explicit Push permission control exists.

- [ ] **Step 3: Implement the settings control and documentation**

Add a user-initiated permission button, supported/denied states, and iOS Home Screen guidance. Document that background completion uses OS notifications and that custom uploaded audio is foreground-only.

- [ ] **Step 4: Run final verification**

Run: `npm.cmd test && npm.cmd run build && git diff --check`

Expected: all tests and build pass with no whitespace errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/settings/sections/AlarmSettings.tsx src/components/settings/sections/AlarmSettings.test.tsx README.md
git commit -m "feat: Add background alert controls"
```

### Task 6: Provision secrets and verify production behavior

**Files:**

- Modify: `workers/timer-notifications/wrangler.jsonc`
- Create: `workers/timer-notifications/.dev.vars.example`

**Interfaces:**

- Requires a user-approved Cloudflare interactive login.
- Requires `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` secrets.

- [ ] **Step 1: Generate VAPID keys locally**

Run: `npx web-push generate-vapid-keys`

Keep the private key out of source control. Add only key names to `.dev.vars.example`.

- [ ] **Step 2: Authenticate and create Cloudflare bindings**

Run: `npx wrangler login`, then create the Worker and SQLite-backed Durable Object binding defined in `wrangler.jsonc`.

- [ ] **Step 3: Upload secrets interactively**

Run `npx wrangler secret put` separately for `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT`.

- [ ] **Step 4: Deploy and record the API origin**

Run: `npx wrangler deploy`

Set `VITE_TIMER_NOTIFICATION_API_URL` to the deployed Worker URL through the GitHub Pages build configuration.

- [ ] **Step 5: Test supported production paths**

Verify on desktop Chromium, Android installed PWA, and iOS/iPadOS Home Screen PWA: permission grant, one hidden running-status notification, one completion notification, notification click navigation, foreground deduplication, pause/reset cancellation, and expired-subscription recovery.

- [ ] **Step 6: Commit configuration only**

```bash
git add workers/timer-notifications/wrangler.jsonc workers/timer-notifications/.dev.vars.example
git commit -m "chore: Configure timer notification deployment"
```
