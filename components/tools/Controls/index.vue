<template>
  <v-row>
    <tools-controls-form v-model="control" :index="index" @created="created" @updated="updated" @reset="reset" />
    <tools-controls-list :controls="controls" :creation-mode="creationMode" @edition="startEdit" />
  </v-row>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import { IControl } from '~~/lib/interfaces/IControl';

export default {
  props: {
    modelValue: {
      type: Array<IControl>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false
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
    created(result: IControl) {
      this.controls.push(result);
    },
    updated(result: IControl) {
      this.controls[this.index] = result
    },
    startEdit(index: number) {
      this.control = cloneDeep(this.controls[index]);
      this.index = index;
    },
    reset() {
      this.index = -1;
      this.control = ToolsFactory.emptyControl();
    }
  }
}
</script>