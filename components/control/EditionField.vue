<template>
  <v-text-field density="compact" variant="outlined" :label="name" v-model="value" @update:modelValue="emit('updated', name, value)" />
</template>

<script setup lang="ts">
import type { Control } from '~/types/tools/Control';

const { control, name } = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  name: { type: String, required: true }
});

const emit = defineEmits<{ updated: [ string, any ]}>();

const value: Ref<String|Number> = ref(control.payload[name]);
</script>