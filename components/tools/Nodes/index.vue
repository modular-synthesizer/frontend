<template>
  <tools-nodes-form @created="addNode" />
  <tools-nodes-list :nodes="nodes" :hide-uuids="creationMode" />
</template>

<script lang="ts">
import { InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    nodes: {
      type: Array<InnerNode>,
      default: () => []
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
  }
}
</script>