<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h4">{{ kind === 'input' ? 'Entrées' : 'Sorties' }}</div>
      <v-table>
        <thead>
          <tr>
            <th>UUID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Cible</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="port in ports">
            <td>{{ port.id }}</td>
            <td>{{ port.name }}</td>
            <td>{{ kind }}</td>
            <td>{{ port.target }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { IToolPort } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Array<IToolPort>,
      default: () => []
    },
    kind: {
      type: String, default: 'input'
    }
  },
  computed: {
    ports() { return this.modelValue; }
  }
}
</script>