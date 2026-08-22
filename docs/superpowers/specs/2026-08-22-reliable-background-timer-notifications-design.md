# Reliable Background Timer Notifications Design

## Goal

Deliver one OS-level completion notification for a running timer even when the PWA is backgrounded or closed, while keeping the visible timer accurate from an absolute end timestamp.

## Scope

- Support desktop browsers, Android PWAs, and iOS/iPadOS Home Screen PWAs that support Web Push and have granted notification permission.
- Replace the service worker's in-memory `setTimeout` and one-second notification interval as the background scheduler.
- Retain the existing foreground timer UI, selected alarm sound, and completion modal.

## Non-goals

- Do not guarantee custom audio playback while the PWA is backgrounded or closed.
- Do not update a background notification body every second.
- Do not add accounts, cross-device timer sync, or a native mobile application.

## Architecture

The React client remains hosted on GitHub Pages. A Cloudflare Worker exposes a small CORS-restricted scheduling API and binds one Durable Object per timer schedule. The client stores an absolute `endAt` timestamp locally, registers its Push subscription with the API, and creates, updates, or cancels a schedule as timer state changes.

Each schedule Durable Object stores the subscription, title, deep link, end timestamp, and state in SQLite-backed Durable Object storage. It sets one Durable Object Alarm at `endAt`. When the alarm fires, it sends an encrypted Web Push completion payload using VAPID credentials stored as Cloudflare secrets. The service worker receives that payload and displays a persistent OS notification. Invalid subscriptions are deleted after 404 or 410 responses.

## Foreground and background behavior

| State                     | Client behavior                                                                                                                                | Background notification behavior                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Visible and running       | Render `endAt - Date.now()` every second and play the selected sound on completion.                                                            | No running-status notification. The server schedule remains as a fallback guarded by a short visible lease.                      |
| Hidden and running        | Stop visual updates, preserve `endAt`, and refresh the server schedule.                                                                        | Show one `Timer running — ends at HH:mm` status notification.                                                                    |
| Visible before completion | Recalculate from `endAt`, close the running-status notification, and refresh a 15-second visible lease every 5 seconds.                        | The Durable Object defers its alarm by five seconds while a valid lease exists, avoiding a duplicate OS completion notification. |
| Complete                  | Persist completed state, cancel the Durable Object alarm, close status notification, and run the existing foreground completion UI if visible. | If hidden or no valid lease, send exactly one completion Push.                                                                   |

The five-second deferral is a deliberate reliability trade-off: a recently visible page gets a short opportunity to complete locally; if it disappears or freezes, the lease expires and the server sends the Push.

## API contract

- `GET /v1/push/public-key` returns `{ publicKey }`.
- `PUT /v1/schedules/:id` accepts `{ capability, endAt, title, deepLink, subscription, visibleUntil }` and creates or replaces that schedule.
- `PATCH /v1/schedules/:id` accepts `{ capability, visibleUntil }` to renew the visible lease.
- `DELETE /v1/schedules/:id` accepts the capability token and cancels the alarm plus stored schedule.

The client creates an opaque UUID schedule ID and a separate opaque capability token, stores both only in local browser storage, and sends the capability with every mutation. The API permits only the production origin and local development origin through CORS. Schedules reject past end times and are capped at 24 hours.

## Failure behavior

- If Push is unsupported or permission is denied, the timer remains fully functional in foreground and the settings UI explains that background completion alerts are unavailable.
- If scheduling fails while hidden, retain `endAt`, retry on the next visibility change, and report a non-blocking in-app warning while visible.
- If the Push endpoint returns 404 or 410, delete the subscription and require a new user-initiated subscription.
- If a notification is clicked, focus an existing timer client or open the app deep link; the client reconciles from `endAt` and completion state.

## Security and privacy

- Keep VAPID private key and contact subject only in Cloudflare Worker secrets.
- Persist only timer title, end timestamp, deep link, and encrypted Push subscription metadata; do not upload custom audio or timer history.
- Use capability tokens to prevent unrelated clients from modifying a schedule.

## Acceptance criteria

1. A hidden or closed supported PWA receives one completion OS notification near the deadline without requiring the user to refocus it.
2. Foreground completion retains the existing sound and modal and does not show a duplicate OS completion notification.
3. Returning to the app always derives the remaining or elapsed state from `endAt`; it never resumes from a stale interval count.
4. A running-status notification shows an end time while the PWA is hidden, then closes on foreground return, reset, pause, or completion.
5. Android and desktop support standard Web Push. iOS/iPadOS instructions require Home Screen installation and a user-initiated permission grant.
