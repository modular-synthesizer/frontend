<template>
  <template v-if="tool !== null">
    <tools-creator v-model="tool" @update:model-value="save" />
  </template>
</template>

<script lang="ts">
import { api } from "~~/lib/api/Api"
import ITool from "~~/lib/interfaces/ITool";
import { pick } from 'lodash';

export default {
  data: () => ({
    tool: null as unknown as ITool
  }),
  async mounted() {
    this.tool = await api.auth_get(`/tools/${this.$route.params.id}`)
  },
  methods: {
    save() {
      const fields: string[] = ['name', 'slots', 'categoryId', 'experimental'];
      api.auth_put(`/tools/${this.tool.id}`, pick(this.tool, fields));
    }
  }
}
</script>
