# Aardvarck Header

This module will become the single Drupal entry point for the site header.

Planned responsibilities:
- provide one block plugin for the full header
- assemble branding, navigation, language, account and cart data
- keep Commerce integration optional for the MVP
- isolate cache-sensitive utilities such as cart state

Current status:
- Storybook owns the frontend component API and interaction layer
- this module currently provides the initial block plugin skeleton only
