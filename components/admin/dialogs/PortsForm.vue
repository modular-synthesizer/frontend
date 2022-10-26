<template>
  <v-form @submit.prevent="addPort" ref="form">
    <v-container fluid>
      <v-row>
        <v-col xs="4" md="2">
          <v-select :items="types" v-model="type" variant="outlined" density="compact" label="Type" />
        </v-col>
        <v-col xs="8" md="3">
          <v-text-field v-model="port.name" variant="outlined" density="compact" label="Nom" />
        </v-col>
        <v-col xs="8" md="3">
          <v-text-field v-model="port.target" variant="outlined" density="compact" label="Noeud" />
        </v-col>
        <v-col xs="4" md="2">
          <v-text-field type="number" variant="outlined" density="compact" v-model="port.index" label="Index" />
        </v-col>
        <v-col xs="12" md="2">
          <v-btn type="submit">Ajouter</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';
import { cloneDeep } from "lodash"

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  computed: {
    innerNodes(): string[] {
      return this.tool.inner_nodes.map(n => n.name)
    }
  },
  data: () => ({
    type: null,
    types: ['input', 'output'],
    port: {
      target: null,
      name: null,
      index: 0
    }
  }),
  methods: {
    addPort() {
      this.$emit("submitted", {type: this.type, port: cloneDeep(this.port)})
      this.$refs.form.reset();
    }
  }
}
</script>