<template>
  <v-form ref="innerNodesForm">
    <v-container fluid> 
      <v-row>
        <v-col sm="10" md="4">
          <v-select
            :items="innerNodes"
            v-model="link.from.node"
            variant="outlined"
            density="compact"
            label="Depuis"
          />
        </v-col>
        <v-col sm="2" md="2">
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            v-model="link.from.index"
          />
        </v-col>
        <v-col sm="10" md="4">
          <v-select
            :items="innerNodes"
            v-model="link.to.node"
            variant="outlined"
            density="compact"
            label="Vers"
          />
        </v-col>
        <v-col sm="2" md="2">
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            v-model="link.to.index"
          />
        </v-col>
        <v-col cols="12">
          <v-btn @click="submit()">Ajouter</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';
import { find } from "lodash"

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
    link: {
      from: { node: null, index: 0 },
      to: { node: null, index: 0 }
    }
  }),
  methods: {
    submit() {
      const found = find(this.tool.inner_links, this.link);
      console.log(this.tool.inner_links);
      console.log(this.link);
      console.log(found)
      if (found === undefined) {
        this.$emit("submitted", this.link)
      }
    }
  }
}
</script>