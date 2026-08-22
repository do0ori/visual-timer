# Changelog

All notable changes to Mellow Visual Timer are documented in this file.

## [0.5.0] - 2026-08-22

### Added

- Reliable background completion alerts through Web Push and a Cloudflare Durable Object scheduler.
- A Background alerts control in Timer & Sound settings, including platform guidance for installed iPhone and iPad PWAs.
- A single, non-intrusive running-status notification while a timer continues in the background.
- A Test alert action for confirming that background notifications work on the current device.

### Changed

- Enabled Cloudflare Worker observability for timer-scheduling requests and Durable Object failures.

### Fixed

- Persisted uploaded alarm audio and made its preview controllable and removable from settings.
- Derived timer state from an absolute end time so timer completion remains accurate after background throttling.
- Made pause, reset, and foreground return cancel or refresh the background alert correctly.
- Request notification permission from the first manual timer start and deliver running-status messages before the page is controlled by the service worker.
- Restored the negative elapsed-time display after a timer completes without retriggering completion handling.
- Registered the development service worker with its app-shell fallback so local notification testing works.
- Created a Push subscription when notification permission was granted before background alerts were enabled.
- Tightened the spacing of links in the About & Developer settings tab.

## [0.4.1] - 2026-08-20

### Fixed

- Made alarm previews consistently stoppable from the settings control, including synthesized alarm sounds.
- Decoupled timer-editor surfaces from the browser color scheme so they follow the selected app theme.
- Widened desktop timer cards and aligned the Routine Timer interactive dial with the Basic Timer editor.

### Changed

- Added staged-file formatting through `lint-staged` and Prettier.

## [0.4.0] - 2026-08-19

### Added

- Compact, expandable routine-step editor for creating and editing sequential timers.
- Context-aware timer creation: the Basic and Routine filters open their matching timer form.

### Changed

- Unified timer type, duration-unit, and list-filter controls with sliding segmented controls.
- Simplified timer cards to prioritize the timer information and management actions.
- Updated the About version and README to reflect the v0.4.0 release.

### Fixed

- Dragging a clock face no longer scrolls the surrounding view; scrolling remains available outside the dial.

## [0.3.0] - 2026-08-19

### Added

- Focus session history, daily and weekly focus statistics, and streak tracking.
- Downloadable social sharing image cards for daily focus achievements.
- Preset alarm sounds, volume control, and custom audio uploads.
- Five built-in themes and custom theme management.
- About-tab version information with a link to release notes.

### Changed

- Combined timer direction, alarm sound, and volume settings into one tab.
- Simplified the focus-statistics sharing UI and added distinct KPI emoji markers.
- Migrated the app build to Vite with Vite PWA support.
