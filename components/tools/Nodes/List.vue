<template>
  <v-row>
    <v-col cols="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th v-if="!hideUuids">UUID</th>
            <th>Nom</th>
            <th>Générateur</th>
            <th>Coordinates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(node, idx) in nodes">
            <td v-if="!hideUuids">{{ node.id }}</td>
            <td>{{ node.name }}</td>
            <td>{{ node.generator }}</td>
            <td>[{{ node.x }} ; {{ node.y }}]</td>
            <td>
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removeNode(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    nodes: {
      type: Array<InnerNode>,
      default: () => []
    },
    hideUuids: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    removeNode(index: number) {
      this.nodes.splice(index, 1);
    }
  }
}
</script>