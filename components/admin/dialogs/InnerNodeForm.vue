<template>
  <v-form ref="innerNodesForm">
    <v-container fluid> 
      <v-row>
        <v-col sm="12" md="5">
          <v-text-field
            variant="outlined"
            density="compact"
            v-model="innerNode.name"
            label="Nom du noeud"
            :rules="[nameUnicity]"
          />
        </v-col>
        <v-col sm="12" md="5">
          <v-text-field
            variant="outlined"
            density="compact"
            v-model="innerNode.generator"
            label="Générateur du noeud"
          />
        </v-col>
        <v-col sm="12" md="2">
          <v-btn @click="submit()">Ajouter</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';
import { find } from "lodash";

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  data: () => ({
    innerNode: { name: "", generator: "" }
  }),
  methods: {
    async submit() {
      const { valid } = await this.$refs.innerNodesForm.validate();
      if (valid) {
        this.$emit("submitted", {
          name: this.innerNode.name,
          generator: this.innerNode.generator
        });
        this.$refs.innerNodesForm.reset();
      }
    },
    nameUnicity() {
      const nameExists: boolean = find(this.tool.inner_nodes, {name: this.innerNode.name})
      return !nameExists || "name.uniq";
    }
  }
}
</script>