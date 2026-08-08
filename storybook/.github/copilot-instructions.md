# Drupal Storybook UI - Development Instructions

This project provides a comprehensive, scalable Storybook setup for developing Drupal components with Twig templates using atomic design principles.

## Architecture

### Component Hierarchy
- **Atoms** - Single interactive elements or basic visual blocks
- **Molecules** - Combinations of atoms forming functional units
- **Organisms** - Complex compositions combining molecules

### Current Components
- **Organisms**: Card (content container)
- **Molecules**: Button, Link, Image

## Design System

### CSS Custom Properties (Variables)
All styling uses CSS variables defined in `src/styles/_root-vars.scss`:

- **Colors**: `--color-primary`, `--color-secondary`, `--color-danger`, etc.
- **Typography**: `--font-size-base`, `--font-size-lg`, `--font-family-base`
- **Spacing**: `--space-1` through `--space-5` (based on `--spacer`)
- **Other**: `--border-radius`, `--border-color`, `--transition-duration`

### Why CSS Variables?
- ✅ Single source of truth for design tokens
- ✅ Global theme switching without code changes
- ✅ Runtime updates via JavaScript
- ✅ Scalable for future growth
- ✅ Drupal integration friendly

## Setup Complete ✅

The project is fully initialized with:
- ✅ Storybook 10 with Vite builder
- ✅ Twig template support via `vite-plugin-twig-drupal`
- ✅ CSS Custom Properties system
- ✅ SCSS for component-level styling
- ✅ Atomic design components (atoms, molecules, organisms)
- ✅ Concurrent dev scripts
- ✅ Production build pipeline
- ✅ Scalable architecture

## Quick Start

```bash
# Run Storybook and watch SCSS simultaneously
npm run dev

# Build for production
npm run build
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run Storybook + watch SCSS |
| `npm run storybook` | Start Storybook only |
| `npm run watch:scss` | Watch and compile SCSS only |
| `npm run build` | Build SCSS and Storybook |
| `npm run build:scss` | Build minified CSS only |
| `npm run build-storybook` | Build Storybook standalone |

## Project Files

### Core Files
- [vite.config.js](../../vite.config.js) - Vite config with Twig namespace
- [.storybook/main.js](../.storybook/main.js) - Storybook configuration
- [.storybook/preview.js](../.storybook/preview.js) - Global preview settings

### Styles
- [src/styles/main.scss](../../src/styles/main.scss) - Main stylesheet
- [src/styles/_root-vars.scss](../../src/styles/_root-vars.scss) - CSS custom properties

### Components
- **Organisms**: [src/components/organisms/card/](../../src/components/organisms/card/)
- **Molecules**:
  - [src/components/molecules/button/](../../src/components/molecules/button/)
  - [src/components/molecules/link/](../../src/components/molecules/link/)
  - [src/components/molecules/image/](../../src/components/molecules/image/)

## Adding New Components

1. Create directory: `src/components/{atoms|molecules|organisms}/{name}/`
2. Create three files:
   - `{name}.twig` - Twig template
   - `{name}.scss` - Component styles (use CSS variables)
   - `{name}.stories.js` - Storybook stories

## SCSS Structure

- **Variables**: Use CSS custom properties only (`var(--color-primary)`)
- **No Magic Numbers**: All hardcoded values should become CSS variables
- **Component Isolation**: Each component file handles its own styling
- **Scalability**: New design tokens added to `_root-vars.scss`

## Browser Support

Open [http://localhost:6006](http://localhost:6006) when running `npm run dev`

## Important Notes

- ✅ All components use Twig templates for Drupal compatibility
- ✅ Component stories are autodocumented in Storybook
- ✅ Use `.twig` suffix for all template files
- ✅ Use CSS variables (`var(--*)`) instead of SCSS variables in styles
- ✅ Keep design tokens in `_root-vars.scss` for maintainability
- ✅ No Sass functions like `darken()` - use CSS opacity for color variations
