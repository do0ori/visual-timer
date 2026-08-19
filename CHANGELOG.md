# Changelog

All notable changes to Mellow Visual Timer are documented in this file.

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
