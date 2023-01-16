<template>
  <v-form class="mt-5">
    <v-row>
      <v-col cols="4">
        <v-text-field variant="outlined" density="comfortable" label="Nom" v-model="node.name" />
      </v-col>
      <v-col cols="4">
        <v-text-field variant="outlined" density="comfortable" label="Générateur" v-model="node.generator" />
      </v-col>
      <v-col cols="4">
        <v-btn color="blue-grey-lighten-5" size="large" @click="addNode">Valider</v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-row>
    <v-col cols="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th>UUID</th>
            <th>Nom</th>
            <th>Générateur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(node, idx) in nodes">
            <td>{{ node.id }}</td>
            <td>{{ node.name }}</td>
            <td>{{ node.generator }}</td>
            <td>
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="deleteNode(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">import { InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Array<InnerNode>,
      default: () => []
    }
  },
  data: () => ({
    node: {
      id: "", name: "", generator: "",
    } as InnerNode,
  }),
  computed: {
    nodes() { return this.modelValue; }
  },
  methods: {
    deleteNode(idx: number) {
      this.nodes.splice(idx, 1);
    },
    addNode() {
      this.nodes.push(this.node);
      this.node = {id: "", name: "", generator: ""}
    }
  }
}
</script>