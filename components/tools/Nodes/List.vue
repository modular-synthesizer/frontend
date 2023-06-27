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
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removeNode(node, idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    nodes: {
      type: Array<InnerNode>,
      default: () => []
    },
    hideUuids: {
      type: Boolean,
      default: () => false
    },
    tool: {
      type: Object as PropType<ITool>,
      required: true,
    }
  },
  methods: {
    async removeNode(node: InnerNode, index: number) {
      await api.auth_delete(`/tools/nodes/${node.id}`, { tool_id: this.tool.id })
      this.nodes.splice(index, 1);
    }
  }
}
</script>