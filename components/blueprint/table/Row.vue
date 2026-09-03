<script setup lang="ts">
import { type Blueprint } from '~/types/blueprints/Blueprint'

const { blueprint } = defineProps({
  blueprint: { type: Object as PropType<Blueprint>, required: true }
});

const url: string = `/blueprints/${blueprint.id}`

const emit = defineEmits<{ deleted: [ Blueprint ] }>();
</script>

<template>
  <tr :id="`blueprint-row-${blueprint.id}`">
    <td>{{ blueprint.id }}</td>
    <td>{{ blueprint.name }}</td>
    <td>{{ blueprint.slots }}</td>
    <td>
      <deletion-dialog size="small" icon :url @confirmed="emit('deleted', blueprint)" />
      <v-btn :to="`/blueprints/${blueprint.id}`" icon variant="text" size="small">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </td>
  </tr>
</template>