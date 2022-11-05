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
            :label="$t('tools.dialog.fields.from.label')"
          />
        </v-col>
        <v-col sm="2" md="2">
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            v-model="link.from.index"
            :label="$t('common.index')"
          />
        </v-col>
        <v-col sm="10" md="4">
          <!-- Ajouter règle de validation pour que si on split sur le point, la première partie soit un inner node -->
          <v-text-field
            v-model="link.to.node"
            variant="outlined"
            density="compact"
            :label="$t('tools.dialog.fields.to.label')"
            :hint="$t('tools.dialog.fields.to.hint')"
          />
        </v-col>
        <v-col sm="2" md="2">
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            v-model="link.to.index"
            :label="$t('common.index')"
          />
        </v-col>
        <v-col cols="12">
          <v-btn @click="submit()">{{ $t('common.validate') }}</v-btn>
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
      if (found === undefined) {
        this.$emit("submitted", this.link)
      }
    }
  }
}
</script>