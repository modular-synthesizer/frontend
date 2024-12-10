<template>
  <v-tooltip :location="location">
    <template #activator="{ props }">
      <v-btn icon @click="emit('click', $event)" v-bind="{ ...props, ...bounds }" :variant="variant">
        <v-icon>mdi-{{ icon }}</v-icon>
      </v-btn>
    </template>
    <slot name="tooltip">
      <span>{{ $t(label) }}</span>
    </slot>
  </v-tooltip>
</template>

<script lang="ts" setup>
type Location = 'bottom'|'top'|'left'|'right';

type Variant = 'outlined'|'plain'|'flat'|'text';

const { label, icon, location, variant, to, } = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: 'plus' },
  location: { type: String as PropType<Location>, default: 'bottom' },
  variant: { type: String as PropType<Variant>, default: 'flat'},
  to: { type: String, default: '' }
});

type EmitType = {
  click: [ MouseEvent ],
};

const emit = defineEmits<EmitType>();

const bounds: ComputedRef<Record<string, any>> = computed(() => ({
  ...( to === '' ? {} : { to }),
}));
</script>