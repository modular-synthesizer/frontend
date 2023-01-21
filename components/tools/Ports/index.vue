<template>
  <tools-ports-form v-model="port" :index="index" :inner-nodes="innerNodes" @created="addPort" @updated="updatePort" @reset="reset" />
  <tools-ports-list :ports="tool.ports" :hide-uuids="creationMode" @edition="startEdit" />
</template>

<script lang="ts">
import { cloneDeep, map } from 'lodash';
import { PropType } from 'vue';
import ITool, { IToolPort } from '~~/lib/interfaces/ITool';

function emptyPort(): IToolPort {
  return { id: "", name: "", kind: "input", index: 0, target: "" }
}

export default {
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
      required: true
    },
    creationMode: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    port: emptyPort(),
    index: -1,
  }),
  computed: {
    tool() {
      return this.modelValue;
    },
    innerNodes() {
      return map(this.tool.nodes, "name");
    }
  },
  methods: {
    startEdit(index: number) {
      const port = this.tool.ports[index];
      this.index = index;
      this.port = cloneDeep(port);
    },
    updatePort(index: number, port: IToolPort) {
      console.log(index, port);
      this.reset();
    },
    addPort(port: IToolPort) {
      console.log(port);
      this.reset();
    },
    reset() {
      this.port = emptyPort();
      this.index = -1
    }
  }
}
</script>