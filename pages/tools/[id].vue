<template>
  <template v-if="tool !== null">
    <tools-creator v-model="tool" @update:model-value="save" />
  </template>
</template>

<script lang="ts">
import {api} from "~~/lib/api/Api"
import ITool from "~~/lib/interfaces/ITool";

export default {
  data: () => ({
    tool: null as unknown as ITool
  }),
  async mounted() {
    this.tool = await api.auth_get(`/tools/${this.$route.params.id}`)
  },
  methods: {
    save() {
      api.auth_put(`/tools/${this.tool.id}`, this.tool);
    }
  }
}
</script>
