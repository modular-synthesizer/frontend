<template>
  <v-row>
    <v-col cols="12">
      <v-table>
        <thead>
          <tr>
            <th>UUID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Cible</th>
            <th>Index</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(port, idx) in tool.ports">
            <td>{{ port.id }}</td>
            <td>{{ port.name }}</td>
            <td>{{ port.kind }}</td>
            <td>{{ port.target }}</td>
            <td>{{ port.index }}</td>
            <td>
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removePort(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { PropType } from 'vue';
import ITool, { IToolPort } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
        required: true
    },
  },
  computed: {
    tool() { return this.modelValue; }
  },
  methods: {
    removePort(index: number) {
      this.tool.ports.splice(index, 1)
    }
  }
}
</script>