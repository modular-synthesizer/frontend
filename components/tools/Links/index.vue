<template>
  <tools-links-form v-model="link" :creation-mode="creationMode" @created="addLink" @reset="reset" />
  <tools-links-list :links="links" :tool="tool" :creation-mode="creationMode" />
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import ITool, { InnerLink } from '~~/lib/interfaces/ITool';

function emptyLink(): InnerLink {
  return { id: "", from: {node: "", index: 0}, to: {node: "", index: 0} };
}

export default {
  props: {
    modelValue: {
      type: Array<InnerLink>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false,
    },
    tool: {
      type: Object as PropType<ITool>,
      required: true,
    },
  },
  data: () => ({
    link: emptyLink()
  }),
  computed: {
    links() { return this.modelValue; }
  },
  methods: {
    async addLink() {
      const response: InnerLink = await api.auth_post('/tools/links', {
        ...this.link,
        tool_id: this.tool.id,
      });
      this.links.push(response);
      this.reset();
    },
    reset() {
      this.link = emptyLink();
    }
  }
}
</script>