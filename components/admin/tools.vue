<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <tool-creator :tool="tool" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useCategories } from '~~/lib/stores/categories';
import ToolCreator from './dialogs/ToolCreator.vue'

export default {
  data: () => ({
    tool: {
      name: "",
      category_id: "",
      inner_nodes: [],
      inner_links: [],
      inputs: [],
      outputs: [],
    }
  }),
  computed: {
    ...mapState(useCategories, ['categories']),
  },
  components: {
    ToolCreator
  }
}
</script>