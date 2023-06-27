<template>
  <v-row>
    <tools-controls-form v-model="control" :index="index" @created="created" @updated="updated" @reset="reset" />
    <tools-controls-list :controls="controls" :creation-mode="creationMode" @edition="startEdit" />
  </v-row>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { api } from '~~/lib/api/Api';
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import { IControl } from '~~/lib/interfaces/IControl';
import ITool from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Array<IControl>,
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
    control: ToolsFactory.emptyControl(),
    index: -1,
    chips: [] as string[],
  }),
  computed: {
    controls() { return this.modelValue; }
  },
  methods: {
    async created(result: IControl) {
      const response: IControl = await api.auth_post('/tools/controls', { ...result, tool_id: this.tool.id });
      this.controls.push(response);
      this.reset();
    },
    async updated(result: IControl) {
      const response: IControl = await api.auth_put(`/tools/controls/${result.id}`, result);
      this.controls[this.index] = response;
      this.reset();
    },
    startEdit({ control, index}: any) {
      this.index = index;
      console.log(this.index);
      this.control = cloneDeep(control);
    },
    reset() {
      this.control = ToolsFactory.emptyControl();
    }
  }
}
</script>