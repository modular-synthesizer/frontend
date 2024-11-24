<template>
  <tools-controls-form v-model="control" :index="index" @created="created" @updated="updated" @reset="reset" />
  <tools-controls-list :tool="tool" :creation-mode="creationMode" @edition="startEdit" />
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import { IControl } from '~~/lib/interfaces/IControl';
import ITool from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';

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
      const response: IControl = await repositories.tool.controls.create(this.tool, result)
      this.controls.push(response);
      this.reset();
    },
    async updated(result: IControl) {
      const response: IControl = await repositories.tool.controls.update(this.tool, this.tool.controls, result)
      this.controls[this.index] = response;
      this.reset();
    },
    startEdit({ control, index}: any) {
      this.index = index;
      this.control = cloneDeep(control);
    },
    reset() {
      this.control = ToolsFactory.emptyControl();
    }
  }
}
</script>