<script lang="ts">
import { mapActions } from "pinia";
import Link from "~~/lib/wrappers/Link";

export default {
  props: {
    link: {
      type: Link,
      required: true
    }
  },
  methods: {
    ...mapActions(useLinksList, ['remove']),
  }
}
</script>

<template>
  <g>
    <Connection
      :start-x="link.from.ax"
      :start-y="link.from.ay"
      :end-x="link.to.ax"
      :end-y="link.to.ay"
      @click="remove(link.id)"
    />
  </g>
</template>