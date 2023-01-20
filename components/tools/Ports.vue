<template>
  <v-form class="mt-5">
    <v-row>
      <v-col cols="4">
        <v-text-field v-model="port.name" variant="outlined" density="comfortable" label="Nom" />
      </v-col>
      <v-col cols="2">
        <v-select :items="['input', 'output']" v-model="port.kind" label="Type" density="comfortable" variant="outlined" />
      </v-col>
      <v-col cols="2">
        <v-text-field type="number" v-model="port.index" variant="outlined" density="comfortable" label="Index" />
      </v-col>
      <v-col cols="2">
        <v-select :items="innerNodes" variant="outlined" density="comfortable" label="Cible" v-model="port.target" />
      </v-col>
      <v-col cols="2">
        <v-btn size="large" color="blue-grey-lighten-5" @click="validate">Valider</v-btn>
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
              <v-btn icon="mdi-pencil" variant="plain" size="small" @click="startEdit(port)" />
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removePort(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { cloneDeep, findIndex } from 'lodash';
import { PropType } from 'vue';
import ITool, { InnerNode, IToolPort } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
        required: true
    },
  },
  data: () => ({
    port: {
      id: "",
      name: "",
      kind: "input",
      index: 0,
      target: ""
    } as IToolPort,
    editing: false,
  }),
  computed: {
    tool() { return this.modelValue; },
    innerNodes() {
      return this.tool.nodes.map((i: InnerNode) => i.name)
    }
  },
  methods: {
    removePort(index: number) {
      this.tool.ports.splice(index, 1)
    },
    startEdit(port: IToolPort) {
      this.editing = true;
      this.port = cloneDeep(port);
    },
    validate() {
      const result: IToolPort = cloneDeep(this.port);
      if (!this.editing) {
        this.tool.ports.push(result);
      }
      else {
        const found = findIndex(this.tool.ports, {id: this.port.id});
        if (found > -1) this.tool.ports[found] = result 
      }
      this.port = {id: "", name: "", kind: "input", index: 0, target: ""}
      this.editing = false;
    }
  }
}
</script>