<template>
  <v-text-field :label="name" v-model="value" @update:modelValue="emit('updated', name, value)" />
</template>

<script setup lang="ts">
import { IControl } from '~~/lib/interfaces/IControl';

const { control, name } = defineProps({
  control: { type: Object as PropType<IControl>, required: true },
  name: { type: String, required: true }
});

const emit = defineEmits<{ updated: [ string, any ]}>();

const value: Ref<String> = ref(control.payload[name]);
</script>