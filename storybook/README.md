# Drupal Storybook UI

This repository is the source of truth for UI components.
It can run completely standalone (without Drupal), and can also export/sync
artifacts for a Drupal theme when used inside a Drupal project.

## Standalone vs Drupal mode

Standalone mode (no Drupal context):
- You can run Storybook and develop components normally.
- `build:drupal` still generates `dist/drupal`.
- Sync to a Drupal theme is skipped if no valid theme directory is found.

Drupal-integrated mode:
- `build:drupal` and `watch:drupal` also sync generated output to the Drupal
  theme.
- Sync target, detection rules, and overrides: see [Drupal integration](#drupal-integration).

## Quick start

Run all commands from the `storybook` folder:

```bash
npm install
npm run dev
```

Storybook runs on `http://localhost:6006`.

## Folder overview

`/.storybook`
- Storybook configuration (framework, addons, preview setup).

`/src/components`
- Source components (Twig, SCSS, stories, assets).
- This is where developers work day-to-day.

`/src/styles`
- Global Storybook/Drupal style source (for example `main.scss`).

`/scripts`
- Build/watch automation scripts.
- `drupal-dist.js` handles build + watch for Drupal export.

`/dist/drupal/components`
- Generated Drupal-ready component output.
- Contains runtime files for Drupal (`.twig`, `.css`, assets) and generated
  `.component.yml`.
- Auto-generated, do not edit manually.

`/dist/drupal/styles`
- Generated global Drupal CSS output (`main.css`).
- Auto-generated, do not edit manually.

## NPM commands

Run these in `storybook/`:

`npm run dev`
- Starts Storybook and watches Drupal export output in parallel.
- Keeps `dist/drupal` up to date continuously.
- In Drupal-integrated mode, also syncs to the Drupal theme continuously.

`npm run storybook`
- Starts Storybook dev server only.
- No Drupal export/watch.

`npm run build`
- Builds static Storybook site (`storybook-static`).

`npm run build:drupal`
- One-time build of Drupal export artifacts to `dist/drupal`.
- Also syncs to Drupal theme when a valid theme folder is found.

`npm run watch:drupal`
- Watches `src/components` and `src/styles`.
- Rebuilds `dist/drupal` on every relevant change.
- Also syncs each rebuild to Drupal theme when available.

## Drupal integration

Theme sync is resolved on every `build:drupal` run and on every rebuild in `watch:drupal`, including when `watch:drupal` is started via `npm run dev`. (dev server mode)

Default target is `../web/themes/custom/drupalstorybook` (relative to `./storybook/`).
If `DRUPAL_THEME_DIR` is set, that value is used instead.

If no theme is found, sync is skipped and only `dist/drupal` is generated.

When a valid Drupal theme is detected, this mapping is applied automatically:

`./storybook/dist/drupal/components` -> `./web/themes/custom/drupalstorybook/components`

`./storybook/dist/drupal/styles` -> `./web/themes/custom/drupalstorybook/styles`
