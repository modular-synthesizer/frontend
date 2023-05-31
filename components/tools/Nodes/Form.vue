<template>
    <v-form class="mt-5">
    <v-row no-gutters>
      <v-col cols="4">
        <v-text-field variant="outlined" density="comfortable" label="Nom" v-model="node.name" />
      </v-col>
      <v-col cols="4" class="pl-2">
        <v-text-field variant="outlined" density="comfortable" label="Générateur" v-model="node.generator" />
      </v-col>
      <v-col cols="1" class="pl-2">
        <v-text-field variant="outlined" density="comfortable" type="number" label="X" v-model="node.x" />
      </v-col>
      <v-col cols="1" class="pl-2">
        <v-text-field variant="outlined" density="comfortable" type="number" label="Y" v-model="node.y" />
      </v-col>
      <v-col cols="2" class="pl-2">
        <v-btn size="small" color="green-lighten-3" @click="validate" icon>
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn class="ml-2" size="small" color="blue-grey-lighten-4" @click="reset" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { InnerNode } from '~~/lib/interfaces/ITool';

function emptyNode(): InnerNode {
  return { id: "", name: "", generator: "", x: 0, y: 0 }
}

export default {
  data: () => ({
    node: emptyNode()
  }),
  methods: {
    validate() {
      this.$emit("created", cloneDeep(this.node));
      this.reset();
    },
    reset() {
      this.node = emptyNode()
    }
  }
}
</script>