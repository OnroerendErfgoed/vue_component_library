# Vue Component Library

Vue 3 component library for Onroerend Erfgoed applications, built on the Govflanders Webuniversum design system.

## 🎯 Key Features

- ✅ **Modular Architecture** - Import only what you need
- ✅ **Tree-Shakeable** - Optimized bundle sizes
- ✅ **TypeScript First** - Full type safety and autocomplete
- ✅ **Vue 3 + Composition API** - Modern Vue development
- ✅ **Govflanders Design System** - Consistent government styling

## 📦 Installation

```bash
yarn add @OnroerendErfgoed/vue_component_library
```

### Required Peer Dependencies

```bash
# Core dependencies (always required)
yarn add vue@^3.4.0 pinia@^2.1.7 vue-i18n@^9.0.0 lodash-es@^4.17.21
yarn add @govflanders/vl-ui-design-system-vue3@~8.0.2
yarn add @govflanders/vl-ui-design-system-style@~3.2.3
yarn add @fortawesome/fontawesome-svg-core@^6.4.0
yarn add @fortawesome/free-solid-svg-icons@^6.4.0
yarn add @fortawesome/vue-fontawesome@^3.1.2
```

### Optional Dependencies by Module

Install only what you need based on the modules you use:

```bash
# For core module
yarn add @vueuse/core@^10.0.0
yarn add @soerenmartius/vue3-clipboard@^1.0.0

# For forms module
yarn add @vuelidate/core@^2.0.2
yarn add @vuelidate/validators@^2.0.2
yarn add date-fns@^2.30.0
yarn add libphonenumber-js@^1.10.37

# For address module
yarn add axios@^1.12.0
yarn add ol@^7.4.0  # Also needed for address autocomplete

# For grid module
yarn add ag-grid-vue3@^34.0.0

# For map module
yarn add ol@^7.4.0
yarn add jsts@2.7.2
yarn add proj4@^2.9.0

# For editor module (TinyMCE)
yarn add @tinymce/tinymce-vue@^4

# For editor module (Quill)
yarn add quill@^2.0.0
yarn add quill-html-edit-button@^3.0.0
yarn add quill-toggle-fullscreen-button@^0.1.3
yarn add vue-quilly@^1.0.5
yarn add parchment@^3.0.0
yarn add fast-diff@^1.3.0
yarn add lodash.clonedeep@^4.5.0
yarn add lodash.isequal@^4.5.0
yarn add quill-delta@^5.1.0
```

## 🚀 Quick Start

### 1. Import CSS

```typescript
// scss/main.scss
import '@OnroerendErfgoed/vue_component_library/scss/main.scss';
import '@OnroerendErfgoed/vue_component_library/vue-components.css';
```

### 2. Import Components from Modules

```typescript
// Import from specific modules for optimal tree-shaking
import { OeButton, OeModal } from '@OnroerendErfgoed/vue_component_library/core';
import { OeInput, OeSelect } from '@OnroerendErfgoed/vue_component_library/forms';
import { OeMap } from '@OnroerendErfgoed/vue_component_library/map';
```

### 3. Use in Components

```vue
<template>
  <OeButton @click="showModal = true"> Open Modal </OeButton>

  <OeModal v-model:open="showModal" title="Hello World">
    <p>Modal content</p>
  </OeModal>
</template>

<script setup lang="ts">
import { OeButton, OeModal } from '@OnroerendErfgoed/vue_component_library/core';
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

## 📚 Available Modules

| Module          | Import Path    | Size    | Use Case                                          |
| --------------- | -------------- | ------- | ------------------------------------------------- |
| **Core**        | `/core`        | ~33 KB  | Essential UI components (buttons, modals, toasts) |
| **Forms**       | `/forms`       | ~24 KB  | Form inputs, validation, date pickers             |
| **Address**     | `/address`     | ~60 KB  | Belgian address components                        |
| **Map**         | `/map`         | ~41 KB  | OpenLayers-based mapping                          |
| **Grid**        | `/grid`        | ~4 KB   | ag-Grid data tables                               |
| **Editor**      | `/editor`      | ~13 KB  | Rich text editors (TinyMCE, Quill)                |
| **Widgets**     | `/widgets`     | ~18 KB  | Complex business widgets                          |
| **Services**    | `/services`    | ~2 KB   | API clients and services                          |
| **Utils**       | `/utils`       | ~2 KB   | Utility functions                                 |
| **Composables** | `/composables` | ~0.1 KB | Vue composables and stores                        |

## 🎨 Usage Examples

### Core Components

```typescript
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
```

```vue
<OeButton mod-primary @click="handleClick">
  Primary Button
</OeButton>
```

### Form Components

```typescript
import { OeDatepicker } from '@OnroerendErfgoed/vue_component_library/forms';
```

```vue
<OeDatepicker v-model="birthDate" />
```

### Address Components

```typescript
import { OeAdres } from '@OnroerendErfgoed/vue_component_library/address';
```

```vue
<OeAdres v-model="address" />
```

### Map Components

```typescript
import { OeMap } from '@OnroerendErfgoed/vue_component_library/map';
```

```vue
<OeMap :api="api" v-model:zone="zone" style="height: 500px" />
```

### Using Composables

```typescript
import { useUtilStore } from '@OnroerendErfgoed/vue_component_library/composables';

const utilStore = useUtilStore();
utilStore.addToast({ message: 'Hello!', type: 'success' });
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── core/          # Essential UI components (buttons, modals, toasts, etc.)
│   │   ├── dumb/      # Presentational components
│   │   ├── smart/     # Components with business logic
│   │   └── index.ts   # Module exports
│   ├── forms/         # Form components (inputs, selects, datepickers, etc.)
│   ├── address/       # Address components
│   ├── map/           # Map components (OpenLayers-based)
│   ├── grid/          # Grid components (ag-Grid wrapper)
│   ├── editor/        # Rich text editor components
│   └── widgets/       # Complex business widgets
├── composables/       # Vue composables
├── directives/        # Vue directives (v-click-outside, etc.)
├── services/          # API services (ActorService, InventarisService, etc.)
├── stores/            # Pinia stores (utilStore)
├── models/            # TypeScript interfaces and types
├── utils/             # Utility functions and helpers
├── core.ts            # Core module entry point
├── forms.ts           # Forms module entry point
├── address.ts         # Address module entry point
├── map.ts             # Map module entry point
├── grid.ts            # Grid module entry point
├── editor.ts          # Editor module entry point
├── widgets.ts         # Widgets module entry point
├── services.ts        # Services module entry point
├── utils.ts           # Utils module entry point
└── composables.ts     # Composables module entry point
```

## 📝 Development Best Practices

### 1. Always Use Modular Imports

```typescript
// ✅ Good - Tree-shakeable
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
// ❌ Bad - Imports everything
import * as components from '@OnroerendErfgoed/vue_component_library/core';
```

### 2. Import Only What You Need

```typescript
// ✅ Good - Only imports one component
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';

// ❌ Bad - Imports entire module even if you only use OeButton
import * as Core from '@OnroerendErfgoed/vue_component_library/core';
const { OeButton } = Core;
```

### 3. Use TypeScript

```typescript
import type { IAdres, IGemeente } from '@OnroerendErfgoed/vue_component_library/address';

const address: IAdres = {
  straat: 'Koning Albert II-laan',
  huisnummer: '19',
  postcode: '1210',
  gemeente: 'Brussel',
};
```

### 4. Leverage Code Splitting

```typescript
// For rarely-used modules, use dynamic imports
const OeMap = defineAsyncComponent(() => import('@OnroerendErfgoed/vue_component_library/map').then((m) => m.OeMap));
```

## 🎯 Consuming Apps: Best Practices for Small Bundle Size

### 1. AG-Grid Module Registration (Grid Module)

**Only register the modules you need** instead of importing all ag-Grid modules:

```typescript
// ❌ Bad - Imports ALL ag-Grid modules (~500KB+)
// ✅ Good - Import only what you need
import { ClientSideRowModelModule, CsvExportModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  // Add only the modules your app uses
]);
```

### 2. FontAwesome Icon Tree-Shaking

**Import only specific icons** instead of the entire icon pack:

```typescript
// ❌ Bad - Imports ALL icons (~1MB+)
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(fas);

// ✅ Good - Import only icons you use
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons';

<template>
  <font-awesome-icon :icon="faUser" />
  <font-awesome-icon :icon="faHome" />
</template>
```

### 3. Check Your Bundle

Regularly analyze your bundle to identify large dependencies using `rollup-plugin-visualizer`

**Look for:**

- Unused ag-Grid modules
- Unused FontAwesome icons
- Duplicate dependencies
- Large modules that could be code-split

### Summary: Expected Savings

| Optimization                          | Potential Savings |
| ------------------------------------- | ----------------- |
| ag-Grid: Register only needed modules | ~300-400 KB       |
| FontAwesome: Import specific icons    | ~800-900 KB       |
| **Total potential savings**           | **~1-1.5 MB**     |

## 🔧 Contributing

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/OnroerendErfgoed/vue_component_library.git
cd vue_component_library

# Install dependencies
yarn install

# Start Storybook
yarn dev
```

### Project Scripts

```bash
yarn dev              # Start Storybook
yarn build            # Build library
yarn test             # Run Cypress component tests
yarn test:unit:dev    # Open Cypress UI
yarn type-check       # TypeScript type checking
yarn lint             # Lint and fix code
yarn format           # Format code
```

### Adding New Components

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Choosing the right module
- Creating components
- Writing tests
- Adding to Storybook
- Using relative imports in entry files

## 📊 Bundle Size Optimization

### Tips for Minimal Bundle Size

1. **Import only needed modules**

   ```typescript
   // Only need buttons? Import only core
   import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
   ```

2. **Use dynamic imports for heavy modules**

   ```typescript
   // Map module is ~18KB - use dynamic import if not always needed
   const OeMap = defineAsyncComponent(() => import('@OnroerendErfgoed/vue_component_library/map').then((m) => m.OeMap));
   ```

3. **Install only required peer dependencies**

   ```bash
   # Don't need maps? Don't install OpenLayers
   # Don't need grid? Don't install ag-Grid
   ```

4. **Optimize ag-Grid** - Register only needed modules (see best practices above)

5. **Optimize FontAwesome** - Import only specific icons (see best practices above)

## 📖 Documentation

- [Migration Guide v3 → v4](MIGRATION.md) - Upgrade from v3 to v4
- [Contributing Guide](CONTRIBUTING.md) - Development guidelines

## 🔗 Links

- [GitHub Repository](https://github.com/OnroerendErfgoed/vue_component_library)
- [Issues](https://github.com/OnroerendErfgoed/vue_component_library/issues)
- [Govflanders Design System - vue 3 components](https://master--642e92e0cda6c627a0601f07.chromatic.com/)
