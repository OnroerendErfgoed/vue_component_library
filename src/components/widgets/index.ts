// Dumb components
export { default as OeActorWidgetDetail } from './dumb/OeActorWidgetDetail.vue';
export { default as OeActorWidgetGridActies } from './dumb/OeActorWidgetGridActies.vue';

// Smart components
export { default as OeActorWidgetGrid } from './smart/OeActorWidgetGrid.vue';
export { default as OeActorWidget } from './smart/OeActorWidget.vue';

// Common components used by this module
export { default as OeLoader } from '@components/core/dumb/OeLoader.vue';
export { default as OeModal } from '@components/core/dumb/OeModal.vue';
export { default as OeGrid } from '@components/grid/dumb/OeGrid.vue';

// Common services used by this module
export { ActorService } from '@services/actor.service';

// Common enums and types used by this module
export type { IActor } from '@models/actor';
