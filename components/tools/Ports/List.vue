<template>
  <v-row>
    <v-col cols="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th v-if="!hideUuids">UUID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Cible</th>
            <th>Index</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(port, idx) in ports">
            <td v-if="!hideUuids">{{ port.id }}</td>
            <td>{{ port.name }}</td>
            <td>{{ port.kind }}</td>
            <td>{{ port.target }}</td>
            <td>{{ port.index }}</td>
            <td>
              <v-btn icon="mdi-pencil" variant="plain" size="small" @click="startEdit(idx)" />
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removePort(idx)" />
            </td>
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
    ports: {
      type: Array<IToolPort>,
      default: () => [],
    },
    hideUuids: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    removePort(index: number) {
      this.ports.splice(index, 1);
    },
    startEdit(index: number) {
      this.$emit('edition', index);
    },
  }
}
</script>