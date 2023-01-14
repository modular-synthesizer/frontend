<template>
  <template v-if="tool !== undefined">
    <tools-creator v-model="tool" />
  </template>
</template>

<script lang="ts">
import {api} from "~~/lib/api/Api"

export default {
  data: () => ({
    tool: undefined
  }),
  async mounted() {
    this.tool = await api.auth_get(`/tools/${this.$route.params.id}`)
  }
}
</script>
