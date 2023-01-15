<template>
  <v-row>
    <v-col cols="12">
      <v-table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Cible</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="port in tool.inputs">
            <td>{{ port.name }}</td>
            <td>input</td>
            <td>{{ port.target }}</td>
          </tr>
          <tr v-for="port in tool.outputs">
            <td>{{ port.name }}</td>
            <td>output</td>
            <td>{{ port.target }}</td>
          </tr>
        </tbody>
      </v-table>
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
    },
  },
  computed: {
    tool() { return this.modelValue; }
  }
}
</script>