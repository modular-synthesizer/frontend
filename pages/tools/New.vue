<template>
  <tools-creator v-model="tool" @update:model-value="saveTool" :creation-mode="true" />
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import ToolsFactory from '~~/lib/factories/ToolsFactory';

export default {
  data: () => ({
    tool: ToolsFactory.empty()
  }),
  methods: {
    saveTool() {
      console.log(this.tool);
      api.auth_post('/tools', this.tool).then((response: any) => {
        console.log(response);
      })
    }
  },
  mounted() {
    const content = localStorage.getItem("import-json");
    if (content !== null) {
        this.tool = JSON.parse(JSON.parse(content));
    }
  }
}
</script>