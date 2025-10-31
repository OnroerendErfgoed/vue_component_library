# Vue component library

Vue components based on @govflanders Webuniversum components with our own branding applied.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) + [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Code style

### Pre-commit hook

See [Pre-commit](https://pre-commit.com/#install) for installation.

After installing this on your local machine, the config in `.pre-commit-config.yaml` will be picked up and makes sure `lint` and `format` are run before commit to guarantee the code style.

### Lint and format on save (VSCode)

Add following config to your `settings.json` to enable lint and format on save.

```json
{
  ...,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Project Setup

```sh
yarn
```

### Development with Storybook

```sh
yarn storybook
```

### Build and watch for Development in implementing applications

```sh
yarn build:watch
```

#### Yalc - for sharing locally developed packages across your local environment. - https://github.com/wclr/yalc

```sh
Yalc publish
```

Afterwards link the package in the desired implementing application.

```sh
yalc add @OnroerendErfgoed/vue_component_library@0.16.0
yalc update
yarn
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
yarn test:unit:dev # or `yarn test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
yarn test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
yarn build
yarn test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

### Format with [Prettier](https://prettier.io/)

```sh
yarn format
```

## Installation & Usage

### Basic Usage

```typescript
import { OeAlert, OeButton, OeInput } from '@OnroerendErfgoed/vue_component_library';
```

### Optimized Imports (Recommended for Production)

For better bundle sizes, import heavy components from their specific modules:

**Grid Components** (~1.2MB)

```typescript
import { GridWorkflow, OeGrid } from '@OnroerendErfgoed/vue_component_library/grid';
```

**Map Components** (~500KB)

```typescript
import { OeGeolocatieWidget } from '@OnroerendErfgoed/vue_component_library/map';
```

### Lazy Loading (Best Practice)

For even better performance, lazy-load heavy modules:

```typescript
// In your router
const GridPage = () => import('./pages/GridPage.vue');

// Or in components
const OeGrid = defineAsyncComponent(() => import('@OnroerendErfgoed/vue_component_library/grid').then((m) => m.OeGrid));
```

### Module Breakdown

| Module | Size   | Use When                        |
| ------ | ------ | ------------------------------- |
| Main   | ~300KB | Basic components, forms, layout |
| Grid   | ~1.2MB | Using AG Grid tables            |
| Map    | ~500KB | Using OpenLayers maps           |
