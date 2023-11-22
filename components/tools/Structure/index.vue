<template>
  <svg>
    <template v-for="node in nodes">
      <tools-structure-node v-model="tool" :node="node" />
    </template>
  </svg>
</template>

<script lang="ts">
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  computed: {
    tool(): ITool {
      return this.modelValue;
    },
    nodes(): InnerNode[] {
      return this.tool.nodes;
    },
  },
};
</script>

<style scoped>
svg {
  margin-top: 20px;
  width: 100%;
  height: 700px;
}
foreignObject {
  overflow: visible;
}
.node-name, .node-generator {
  display: block;
}
.node-generator {
  font-style: italic;
  color: silver;
  font-size: 12px;
}
.node-parameter {
  width: 100px;
  border-top: none!important;
}
.node-wrapper, .node-parameter {
  padding: 3px 6px 3px 12px;
  border: 1px solid white;
}
</style>