<template>
  <v-form ref="innerNodesForm" @submit.prevent="submit">
    <v-container fluid> 
      <v-row>
        <v-col sm="12" md="5">
          <v-text-field
            variant="outlined"
            density="compact"
            v-model="innerNode.name"
            :label="$t('common.name')"
            :hint="$t('tools.dialog.fields.node_name.hint')"
            :rules="[nameUnicity]"
          />
        </v-col>
        <v-col sm="12" md="5">
          <v-select
            variant="outlined"
            density="compact"
            v-model="innerNode.generator"
            :items="generators"
            :label="$t('tools.dialog.fields.generator.label')"
            :hint="$t('tools.dialog.fields.generator.hint')"
          />
        </v-col>
        <v-col sm="12" md="2">
          <v-btn @click="submit()">{{ $t('common.validate') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';
import { find } from "lodash";
import { useGenerators } from '~~/lib/stores/tools/generators';
import { mapActions, mapState } from 'pinia';

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  data: () => ({
    innerNode: { name: "", generator: null }
  }),
  computed: {
    ...mapState(useGenerators, ['generators'])
  },
  mounted() {
    this.innerNode.generator = this.generators[0]
  },
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
    },
    ...mapActions(useGenerators, ['fetchGenerators'])
  }
}
</script>