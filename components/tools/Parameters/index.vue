<template>
  <tools-parameters-form v-model="parameter" :index="index" @created="addParameter" @updated="updateParameter" @reset="reset" />
  <tools-parameters-list :parameters="parameters" :creation-mode="creationMode" @edition="startEdit" />
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { api } from '~~/lib/api/Api';
import ITool, { IToolParameter } from '~~/lib/interfaces/ITool';

function emptyParameter() {
  return {id: "", name: "", targets: [] as string[], default: 50, minimum: 0, maximum: 100, step: 1, precision: 0}
}

export default {
  props: {
    modelValue: {
      type: Array<IToolParameter>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false
    },
    tool: {
      type: Object as PropType<ITool>,
      required: true,
    }
  },
  data: () => ({
    parameter: emptyParameter(),
    index: -1,
  }),
  computed: {
    parameters() { return this.modelValue; },
  },
  methods: {
    async addParameter(result: IToolParameter) {
      const response = await api.auth_post('/tools/parameters', {
        ...result,
        tool_id: this.tool.id,
      });
      this.parameters.push(response);
      this.reset();
    },
    async updateParameter(result: IToolParameter) {
      const response = await api.auth_put(`/tools/parameters/${result.id}`, result)
      this.parameters[this.index] = response;
      this.reset();
    },
    reset() {
      this.parameter = emptyParameter();
      this.index = -1;
    },
    startEdit(index: number) {
      this.index = index;
      this.parameter = cloneDeep(this.parameters[index])
    }
  }
}
</script>