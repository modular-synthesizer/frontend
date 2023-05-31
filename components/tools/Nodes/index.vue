<template>
  <tools-nodes-form @created="addNode" />
  <tools-nodes-list :nodes="nodes" :hide-uuids="creationMode" />
  <tools-nodes-graph :nodes="nodes" :links="tool.links" />
</template>

<script lang="ts">
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true,
    },
    creationMode: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    addNode(node: InnerNode) {
      this.nodes.push(node);
    }
  },
  computed: {
    nodes(): Array<InnerNode> {
      return this.tool.nodes;
    },
  }
}
</script>