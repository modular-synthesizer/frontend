<template>
  <v-chip
    size="small"
    closable
    class="mr-1"
    v-for="key in chips"
    @click:close="emit('closed', control, key)"
  >
    {{ key }} = {{ control.payload[key] }}
  </v-chip>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IControl } from '~~/lib/interfaces/IControl';

const { control } = defineProps({
  control: { type: Object as PropType<IControl>, required: true },
});

const chips: ComputedRef<string[]> = computed((): string[] => {
  const keys: string[] = Object.keys(control.payload).sort();
  return keys.filter((k: string) => !['x', 'y'].includes(k));
});

const emit = defineEmits<{ closed: [ control: IControl, key: string ]}>();
</script>