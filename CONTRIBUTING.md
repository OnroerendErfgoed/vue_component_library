# Contributing to Vue Component Library

## 🎯 Development Principles

1. **Modular First** - Keep components in the right module
2. **Tree-Shakeable** - Use relative imports in entry files
3. **Type-Safe** - Full TypeScript coverage
4. **Tested** - Write Cypress component tests
5. **Documented** - Add Storybook stories

## 📁 Project Structure

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

## 🚀 Getting Started

```bash
# Install dependencies
yarn install

# Start Storybook (development environment)
yarn dev

# Run tests
yarn test

# Type check
yarn type-check

# Build
yarn build
```

## ✨ Adding a New Component

### Step 1: Choose the Right Module

| Module    | Purpose                       | Examples               |
| --------- | ----------------------------- | ---------------------- |
| `core`    | Essential UI, used everywhere | OeButton, OeModal      |
| `forms`   | Form inputs and validation    | OeSelect, OeDatepicker |
| `address` | Address-specific              | OeAdres                |
| `map`     | Mapping functionality         | OeMap                  |
| `grid`    | Data tables                   | OeGrid                 |
| `editor`  | Rich text editing             | OeTinyMCE, OeEditor    |
| `widgets` | Complex business logic        | OeActorWidget          |

### Step 2: Create the Component

```bash
# Create in the right folder
src/components/[module]/dumb/OeYourComponent.vue
# or
src/components/[module]/smart/OeYourComponent.vue
```

**Dumb vs Smart:**

- **Dumb**: Pure presentational, no API calls, props-driven
- **Smart**: Contains business logic, API calls, state management

### Step 3: Export from Module Index

```typescript
// src/components/[module]/index.ts
export { default as OeYourComponent } from './dumb/OeYourComponent.vue';

// If you have types
export type { IYourComponentProps } from '../../models/yourComponent';
```

### Step 4: Update Entry File (Use Relative Imports!)

```typescript
// src/[module].ts
/**
 * [Module] Module
 * Description of what this module provides
 */

export * from './components/[module]';
```

### Step 5: Add TypeScript Types

```typescript
// src/models/yourComponent.ts
export interface IYourComponentProps {
  title: string;
  enabled: boolean;
  items?: string[];
}

export interface IYourComponentEmits {
  (e: 'update', value: string): void;
  (e: 'submit'): void;
}
```

### Step 6: Write Tests

```typescript
// src/__tests__/[module]/YourComponent.cy.ts
import { OeYourComponent } from '@components/[module]';

describe('OeYourComponent', () => {
  it('renders correctly', () => {
    cy.mount(OeYourComponent, {
      props: {
        title: 'Test Title',
      },
    });

    cy.contains('Test Title').should('be.visible');
  });

  it('emits update event', () => {
    const onUpdate = cy.stub().as('updateHandler');

    cy.mount(OeYourComponent, {
      props: {
        onUpdate,
      },
    });

    cy.get('[data-cy=input]').type('test');
    cy.get('@updateHandler').should('have.been.calledWith', 'test');
  });
});
```

### Step 7: Create Storybook Story

```typescript
// src/components/[module]/YourComponent.stories.ts
import OeYourComponent from './dumb/OeYourComponent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeYourComponent> = {
  title: '[Module]/OeYourComponent',
  component: OeYourComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    enabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Title',
    enabled: true,
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled State',
    enabled: false,
  },
};
```

## 📝 Code Style Guidelines

### Vue Components

```vue
<template>
  <div class="oe-your-component">
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IYourComponentProps } from '@models/yourComponent';

// Define props with TypeScript interface
interface Props extends IYourComponentProps {
  // Add component-specific props if needed
}

const props = withDefaults(defineProps<Props>(), {
  enabled: true,
});

// Define emits
const emit = defineEmits<{
  update: [value: string];
  submit: [];
}>();

// Use composition API
const isActive = computed(() => props.enabled);

// Methods
const handleSubmit = () => {
  emit('submit');
};
</script>

<style scoped lang="scss">
.oe-your-component {
  // Component styles
}
</style>
```

### TypeScript

```typescript
// Use interfaces for props
export interface IYourProps {
  id: string;
  name: string;
  optional?: boolean;
}

// Use type for unions/intersections
export type Status = 'active' | 'inactive' | 'pending';

// Export types separately
export type { IYourProps, Status };
```

### Imports

```typescript
// ✅ In component files - path aliases are OK
import { formatDate } from '@utils/date';
import type { IAdres } from '@models/locatie';

// ✅ In entry files (src/core.ts, etc.) - use relative imports
export * from './components/core';
export { useUtilStore } from './stores/utilStore';

// ✅ In module index files - use relative imports
export { default as OeButton } from './dumb/OeButton.vue';
export type { IButtonProps } from '../../models/button';
```

## 🔍 Import Rules (Important!)

### Why Relative Imports in Entry Files?

`vue-tsc` (TypeScript compiler for Vue) doesn't always resolve path aliases (`@components`, `@utils`) correctly when generating `.d.ts` declaration files. This causes build errors.

**Solution:** Use relative imports in entry point files.

### Where to Use What

| File Type                                  | Import Style        | Example                                                     |
| ------------------------------------------ | ------------------- | ----------------------------------------------------------- |
| Entry files (`src/[module].ts`)            | **Relative**        | `export * from './components/core'`                         |
| Module index (`src/components/*/index.ts`) | **Relative**        | `export { default as OeButton } from './dumb/OeButton.vue'` |
| Component files (`.vue`, nested `.ts`)     | **Path aliases OK** | `import { formatDate } from '@utils/date'`                  |

### Examples

```typescript
// ✅ GOOD - In component file (OeButton.vue)
import { formatDate } from '@utils/date';
import type { IToast } from '@models/toast';

// ❌ BAD - In entry file (src/core.ts)
export * from '@components/core';
export { useUtilStore } from '@stores/utilStore';

// ✅ GOOD - In entry file (src/core.ts)
export * from './components/core';
export { useUtilStore } from './stores/utilStore';
```

## 🧪 Testing Guidelines

### Component Tests

- Test user interactions
- Test props and emits
- Test slots
- Test accessibility
- Use data-cy attributes for selectors

```vue
<!-- In component -->
<button data-cy="submit-button" @click="handleSubmit">
  Submit
</button>
```

```typescript
// In test
cy.get('[data-cy=submit-button]').click();
```

### Running Tests

```bash
# Run all tests
yarn test

# Open Cypress UI
yarn test:unit:dev

# Run specific test
yarn test:unit --spec "src/__tests__/core/Button.cy.ts"
```

## 🎨 Styling Guidelines

### SCSS Structure

```scss
// Component styles
.oe-your-component {
  // Base styles

  &__element {
    // BEM element
  }

  &--modifier {
    // BEM modifier
  }

  // State classes
  &.is-active {
    // Active state
  }

  &.is-disabled {
    // Disabled state
  }
}
```

### Use Pyoes Variables

```scss
@import '@OnroerendErfgoed/pyoes/scss/base-variables';

.oe-component {
  color: $primary-color;
}
```

## 📦 Building and Publishing

### Before Publishing

```bash
# 1. Type check
yarn type-check

# 2. Run tests
yarn test

# 3. Build
yarn build

# 4. Verify build output
ls -la dist/
cat dist/core.d.ts  # Check types are generated

# 5. Check bundle sizes
yarn build
# Review dist/stats.html
```

### Publishing Checklist

- [ ] All tests passing
- [ ] Build and typecheck successful
- [ ] Declaration files (`.d.ts`) generated correctly
- [ ] Peer dependencies documented
- [ ] Migration guide updated (if breaking changes)

### Version Bumping

```bash
# Patch (bug fixes)
yarn version --patch

# Minor (new features, backward compatible)
yarn version --minor

# Major (breaking changes)
yarn version --major
```

## 🐛 Common Issues

### Types Not Working in Consumer Apps

**Problem:** `.d.ts` files have incorrect paths.

**Solution:**

1. Use relative imports in entry files
2. Run `yarn build` to regenerate
3. Check `dist/*.d.ts` for correct paths

### Bundle Size Too Large

**Problem:** Accidentally importing entire modules.

**Solution:**

```typescript
// ❌ Bad
import * as Core from '@OnroerendErfgoed/vue_component_library/core';
// ✅ Good
import { OeButton } from '@OnroerendErfgoed/vue_component_library/core';
```

## 📚 Resources

- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/overview)
- [Storybook Docs](https://storybook.js.org/docs)
- [Govflanders Design System - vue 3 components](https://master--642e92e0cda6c627a0601f07.chromatic.com/)
