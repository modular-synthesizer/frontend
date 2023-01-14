<template>
  <v-row class="mt-5">
    <v-col cols="4" v-if="tool.id !== ''">
      <v-text-field v-model="tool.id" disabled variant="outlined" label="UUID" />
    </v-col>
    <v-col :cols="tool.id === '' ? 6 : 4">
      <v-text-field v-model="tool.name" variant="outlined" label="Name" />
    </v-col>
    <v-col :cols="tool.id === '' ? 6 : 4">
      <v-text-field v-model="tool.slots" variant="outlined" label="Slots" type="number" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
        required: true
    }
  },
  computed: {
    tool() { return this.modelValue }
  }
}
</script>