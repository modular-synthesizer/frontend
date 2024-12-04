<template>
  <v-select v-model="value" :items="components" density="compact" variant="outlined" @update:modelValue="emit('updated', value)" />
</template>

<script setup lang="ts">
import { IControl } from '~~/lib/interfaces/IControl';
import { controlsPayloads } from '~~/lib/types/controls';

const { control } = defineProps({
  control: { type: Object as PropType<IControl>, required: true }
});

console.log(control);

const emit = defineEmits<{ updated: [ string ]}>();

const value: Ref<string> = ref(control.component);

const components = Object.keys(controlsPayloads)
</script>