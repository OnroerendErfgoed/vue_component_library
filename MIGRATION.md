# Migration Guide: v3 to v4

## Overview

Version 4.0 introduces a **modular architecture** with tree-shakeable exports, improved TypeScript support, and better bundle optimization.

## Breaking Changes

### 1. Modular Imports Required

You **must** import from specific modules. The default export has been removed.

**Before (v3):**

```typescript
import { OeButton, OeDatepicker, OeMap } from '@OnroerendErfgoed/vue_component_library';
```

**After (v4):**

```typescript
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
import { OeMap } from '@OnroerendErfgoed/vue_component_library/map';
```

### 2. CSS Import Paths Changed

The `/dist/` prefix has been removed from CSS import paths.

**Before (v3):**

```typescript
// Compiled CSS
// Or SCSS
import '@OnroerendErfgoed/vue_component_library/dist/scss/main.scss';
import '@OnroerendErfgoed/vue_component_library/dist/vue-components.css';
```

**After (v4):**

```typescript
// Compiled CSS
// Or SCSS
import '@OnroerendErfgoed/vue_component_library/scss/main.scss';
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
```

### 3. All Components Now Have 'Oe' Prefix

All components are now consistently prefixed with `Oe` for better namespacing and to avoid conflicts.

**Component naming in v4:**

- ✅ All components: `OeButton`, `OeDatepicker`, `OeSelect`, `OeMap`, etc.
- ✅ All composables: `useAdres`, `useAdresAPI`, `useUtilStore`
- ✅ All services: `ActorService`, `HttpService`, `InventarisApiService`, etc.
- ✅ All directives: `vClickOutside`

**Note:** If you were using components without the `Oe` prefix in v3, you'll need to update them. Most components already had the prefix in v3, but this ensures consistency across the entire library.

## Available Modules

| Module          | Import Path    | Gzipped Size | Description                                           |
| --------------- | -------------- | ------------ | ----------------------------------------------------- |
| **Composables** | `/composables` | ~0.13 KB     | Store exports only (re-exports utilStore)             |
| **Grid**        | `/grid`        | ~1.61 KB     | Data grid components (ag-Grid wrapper)                |
| **Services**    | `/services`    | ~0.85 KB     | API services (auth, actor, inventaris, ID)            |
| **Editor**      | `/editor`      | ~3.54 KB     | Rich text editor (Quill)                              |
| **Utils**       | `/utils`       | ~1.03 KB     | Utility functions, validators, i18n                   |
| **Widgets**     | `/widgets`     | ~4.48 KB     | Complex widgets (Actor, Locatie, Betrokkene)          |
| **Address**     | `/address`     | ~9.36 KB     | Belgian address components with autocomplete          |
| **Map**         | `/map`         | ~11.59 KB    | OpenLayers map components                             |
| **Core**        | `/core`        | ~9.31 KB     | Essential UI components (Button, Modal, Header, etc.) |
| **Forms**       | `/forms`       | ~6.46 KB     | Form inputs, filters, validation                      |

## Migration Steps

### Step 1: Update CSS Imports

```diff
# Compiled CSS
- import '@OnroerendErfgoed/vue_component_library/dist/vue-components.css';
+ import '@OnroerendErfgoed/vue_component_library/vue-components.css';

# SCSS (if using)
- import '@OnroerendErfgoed/vue_component_library/dist/scss/main.scss';
+ import '@OnroerendErfgoed/vue_component_library/scss/main.scss';
```

### Step 2: Update Component Imports

**Find and replace pattern:**

```typescript
// Before
import { OeButton, OeDatepicker, OeMap, OeAdres } from '@OnroerendErfgoed/vue_component_library';

// After - import from specific modules
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
import { OeMap } from '@OnroerendErfgoed/vue_component_library/map';
import { OeAdres } from '@OnroerendErfgoed/vue_component_library/address';
```

### Step 3: Verify Component Names Have 'Oe' Prefix

Ensure all component references in your templates and code use the `Oe` prefix:

```vue
<template>
  <!-- ✅ Correct - All components use Oe prefix -->
  <OeButton @click="handleClick">Click me</OeButton>
  <OeSelect v-model="country" :options="countries" />
  <OeMap :center="[4.4025, 51.2194]" />
</template>
```

### Step 4: Install Required Peer Dependencies

```bash
# Core dependencies (always required)
pnpm add vue@^3.5.11 pinia@^3.0.0 vue-i18n@^11.4.5 lodash-es@^4.18.0
pnpm add @govflanders/vl-ui-design-system-vue3@^8.2.0
pnpm add @govflanders/vl-ui-design-system-style@~3.2.3
pnpm add @fortawesome/fontawesome-svg-core@^6.4.0
pnpm add @fortawesome/free-solid-svg-icons@^6.4.0
pnpm add @fortawesome/vue-fontawesome@^3.1.2
```

### Step 5: Install Optional Dependencies (Only What You Need)

Based on which modules you're using:

```bash
# If using core module
pnpm add @vueuse/core@^10.0.0
pnpm add @soerenmartius/vue3-clipboard@^0.1.2

# If using forms module
pnpm add @vuelidate/core@^2.0.2 @vuelidate/validators@^2.0.2
pnpm add date-fns@^2.30.0 libphonenumber-js@^1.10.37

# If using address module
pnpm add axios@^1.12.0
pnpm add ol@^7.4.0  # Also needed for address autocomplete

# If using grid module
pnpm add ag-grid-vue3@^34.0.0

# If using map module
pnpm add ol@^7.4.0 jsts@2.7.2 proj4@^2.9.0

# If using editor module (Quill)
pnpm add quill@^2.0.0 quill-html-edit-button@^3.0.0
pnpm add quill-toggle-fullscreen-button@^0.1.3 vue-quilly@^1.0.5
pnpm add parchment@^3.0.0 fast-diff@^1.3.0
pnpm add lodash.clonedeep@^4.5.0 lodash.isequal@^4.5.0 quill-delta@^5.1.0
```

### Step 6: Test Your Application

```bash
pnpm dev
pnpm build
```

Check that:

- ✅ All components render correctly
- ✅ All component names have the `Oe` prefix
- ✅ Fonts are still loaded (included in library CSS)
- ✅ Bundle size matches your usage
- ✅ No console errors

## Benefits of v4

### 🎯 Tree-Shaking

Only import what you use. The modular structure allows bundlers to eliminate unused code.

**Example 1: Using only core components**

```typescript
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
import { OeButton, OeModal } from '@OnroerendErfgoed/vue_component_library/core';

// Module: ~9.31 KB (gzipped)
// Shared deps (first load): ~10.90 KB
// CSS: ~6.54 KB
// Total first load: ~26.75 KB
```

**Example 2: Forms-heavy application**

```typescript
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
import { OeDatepicker, OeSelect } from '@OnroerendErfgoed/vue_component_library/forms';

// Module: ~6.46 KB (gzipped)
// Shared deps (first load): ~10.90 KB
// CSS: ~6.54 KB
// Total first load: ~23.90 KB
```

**Example 3: Minimal utility usage**

```typescript
import { removeEmptyValues } from '@OnroerendErfgoed/vue_component_library/utils';

// Module: ~1.03 KB (gzipped)
// Shared deps: ~1.17 KB (object utilities only)
// Total: ~2.20 KB
```

### 🚀 Better Performance

- Faster initial load times
- Smaller JavaScript bundles through modular imports
- Code splitting friendly
- Only load dependencies you actually use
- Shared code loaded once and cached

### 💪 Better TypeScript Support

- Full type inference for all modules
- Better autocomplete in IDEs
- Declaration maps for debugging
- Proper type checking across module boundaries

### 🏷️ Consistent Naming

- All components use the `Oe` prefix for clear namespacing
- Reduces naming conflicts with other libraries
- Easier to identify library components in your codebase

## Migration Examples

### Example 1: Simple Form Page

**Before (v3):**

```typescript
import '@OnroerendErfgoed/vue_component_library/dist/vue-components.css';
import { OeButton, OeDatepicker, OeSelect } from '@OnroerendErfgoed/vue_component_library';
```

**After (v4):**

```typescript
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
import { OeDatepicker, OeSelect } from '@OnroerendErfgoed/vue_component_library/forms';
```

### Example 2: Address Form

**Before (v3):**

```typescript
import '@OnroerendErfgoed/vue_component_library/dist/vue-components.css';
import { OeAdres, OeButton, OeDatepicker } from '@OnroerendErfgoed/vue_component_library';
```

**After (v4):**

```typescript
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
import { OeAdres } from '@OnroerendErfgoed/vue_component_library/address';
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
```

### Example 3: Map Application

**Before (v3):**

```typescript
import '@OnroerendErfgoed/vue_component_library/dist/vue-components.css';
import { OeButton, OeMap, OeZoneerder } from '@OnroerendErfgoed/vue_component_library';
```

**After (v4):**

```typescript
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
import { OeMap, OeZoneerder } from '@OnroerendErfgoed/vue_component_library/map';
```

### Example 4: Using SCSS

**Before (v3):**

```scss
// In your main.scss
@import '@OnroerendErfgoed/vue_component_library/dist/scss/main.scss';

// Custom overrides
.my-component {
  // Your styles
}
```

**After (v4):**

```scss
// In your main.scss
@import '@OnroerendErfgoed/vue_component_library/scss/main.scss';

// Custom overrides
.my-component {
  // Your styles
}
```

## Troubleshooting

### "Cannot find module" errors

Make sure you're importing from the correct module. Use the component location reference above.

```typescript
// ❌ Wrong
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/core';

// ✅ Correct
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
```

### CSS not loading

Make sure you've updated the CSS import path:

```typescript
// ❌ Old path (v3)
import '@OnroerendErfgoed/vue_component_library/dist/vue-components.css';
// ✅ New path (v4)
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
```

For SCSS:

```scss
// ❌ Old path (v3)
@import '@OnroerendErfgoed/vue_component_library/dist/scss/main.scss';

// ✅ New path (v4)
@import '@OnroerendErfgoed/vue_component_library/scss/main.scss';
```

### Module '"@OnroerendErfgoed/vue_component_library/X"' has no exported member 'Y'

This means the component is in a different module. Check the [Component Location Reference](#component-location-reference) above.

Common mistakes:

- `useAdres` is in `/address` (not `/composables`)
- `OeDatepicker` is in `/forms` (not `/core`)
- `OeMap` is in `/map` (not `/core`)

**Remember:** All components have the `Oe` prefix!

### Missing peer dependencies

You'll see warnings like:

```
Warning: @OnroerendErfgoed/vue_component_library requires a peer of ol@^7.4.0 but none is installed.
```

**Solution:** Only install peer dependencies for modules you use:

- Using map components? → Install `ol`, `jsts`, `proj4`
- Using address components? → Install `axios`, `ol` (for autocomplete features)
- Using grid components? → Install `ag-grid-vue3`
- Using form components? → Install `@vuelidate/core`, `@vuelidate/validators`, `date-fns`, `libphonenumber-js`
- Using editor (Quill)? → Install `quill`, `vue-quilly`, and related packages
- Not using these modules? → You can ignore the warnings (they're optional)

### Bundle size larger than expected

Check that you're not accidentally importing entire modules:

```typescript
// ❌ Bad - imports everything from forms module (~6.46 KB)
import * as Forms from '@OnroerendErfgoed/vue_component_library/forms';
const { OeDatepicker } = Forms;

// ✅ Good - imports only what you need
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
```

Also check for dynamic imports of heavy modules:

```typescript
// For rarely-used heavy modules, use dynamic imports
const OeMap = defineAsyncComponent(() => import('@OnroerendErfgoed/vue_component_library/map').then((m) => m.OeMap));
```

### TypeScript errors after upgrading

1. Clear your TypeScript cache:

```bash
rm -rf node_modules/.vite
rm -rf node_modules/.cache
```

2. Restart your TypeScript server in your IDE

3. Make sure you're using the correct import paths

4. Verify all components use the `Oe` prefix

## Best Practices

### 1. Group Imports by Module

```typescript
// ✅ Good - organized and readable
import { OeButton, OeModal } from '@OnroerendErfgoed/vue_component_library/core';
import { OeSelect, OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
import { OeAdres, useAdres } from '@OnroerendErfgoed/vue_component_library/address';
import '@OnroerendErfgoed/vue_component_library/vue-components.css';

// ❌ Harder to read
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
import { OeModal } from '@OnroerendErfgoed/vue_component_library/core';
import { OeSelect } from '@OnroerendErfgoed/vue_component_library/forms';
```

### 2. Use Dynamic Imports for Heavy Modules

```typescript
// Map module is ~11.59 KB - use dynamic import if not always needed
const OeMap = defineAsyncComponent(() => import('@OnroerendErfgoed/vue_component_library/map').then((m) => m.OeMap));

// Core module is ~9.31 KB, but if you only need it on specific pages
const OeModal = defineAsyncComponent(() =>
  import('@OnroerendErfgoed/vue_component_library/core').then((m) => m.OeModal)
);
```

### 3. Import Types Separately

```typescript
import { OeAdres } from '@OnroerendErfgoed/vue_component_library/address';
import type { IAdres, IGemeente } from '@OnroerendErfgoed/vue_component_library/address';
```

### 4. Check Bundle Size Regularly

Use your bundler's analysis tool:

```bash
# For Vite
pnpm build
# Check dist/stats.html
```

### 5. Use SCSS for Better Customization

If you need to customize component styles, use SCSS imports instead of compiled CSS:

```scss
// Import SCSS for customization
@import '@OnroerendErfgoed/vue_component_library/scss/main.scss';

// Override variables or add custom styles
.oe-button {
  // Your customizations
}
```

### 6. Start Small, Add Modules as Needed

```typescript
// ✅ Good - Start with minimal imports
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core'; // 9.31 KB
// Add more modules only when needed

// ❌ Avoid - Don't import everything upfront
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
import { OeAdres } from '@OnroerendErfgoed/vue_component_library/address';
import { OeMap } from '@OnroerendErfgoed/vue_component_library/map';
// ... unless you're actually using all of them
```

### 7. Leverage the Oe Prefix for Clarity

```vue
<template>
  <!-- Easy to identify library components -->
  <OeButton>Click me</OeButton>
  <OeInput v-model="name" />

  <!-- vs your own custom components -->
  <MyCustomButton>Custom</MyCustomButton>
  <CustomInput v-model="email" />
</template>
```

## Need Help?

- 📖 [Full Documentation](https://github.com/OnroerendErfgoed/vue_component_library#readme)
- 🐛 [Report Issues](https://github.com/OnroerendErfgoed/vue_component_library/issues)
