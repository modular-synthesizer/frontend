<template>
  <tools-nodes-form @created="addNode" @updated="updateNode" />
  <tools-nodes-list :tool="tool" :nodes="nodes" :hide-uuids="creationMode" />
</template>

<script lang="ts">
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';
import { api } from '~~/lib/api/Api'

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
    async addNode(node: InnerNode) {
      const response: InnerNode = await api.auth_post('/tools/nodes', { ...node, tool_id: this.tool.id });
      this.nodes.push(response);
    },
    updateNode(node: InnerNode) {

    }
  },
  computed: {
    nodes(): Array<InnerNode> {
      return this.tool.nodes;
    },
  }
}
</script>