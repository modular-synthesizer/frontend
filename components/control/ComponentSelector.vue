<template>
  <v-select v-model="value" :items="components" density="compact" variant="outlined" @update:modelValue="emit('updated', value)" />
</template>

<script setup lang="ts">
import type { ComponentNames, Control } from '~/types/tools/Control';
import { controlsPayloads } from '~~/lib/types/controls';

const { control } = defineProps({
  control: { type: Object as PropType<Control>, required: true }
});

const emit = defineEmits<{ updated: [ ComponentNames ]}>();

const value: Ref<ComponentNames> = ref(control.component);

const components = Object.keys(controlsPayloads)
</script>