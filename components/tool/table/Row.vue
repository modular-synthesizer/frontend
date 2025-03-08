<script setup lang="ts">
import { type Tool } from '~/types/tools/Tool'

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
});

const url: string = `/tools/${tool.id}`

const emit = defineEmits<{ deleted: [ Tool ] }>();
</script>

<template>
  <tr :id="`tool-row-${tool.id}`">
    <td>{{ tool.id }}</td>
    <td>{{ tool.name }}</td>
    <td>{{ tool.slots }}</td>
    <td>
      <deletion-dialog size="small" icon :url @confirmed="emit('deleted', tool)" />
      <v-btn :to="`/tools/${tool.id}`" icon variant="text" size="small">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </td>
  </tr>
</template>