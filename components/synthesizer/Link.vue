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
    ...mapActions(useLinkDrag, ['magnetize', 'unmagnetize', 'dragstart']),
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
      @start-mousedown="$event => dragstart(link.from, $event)"
      @start-mouseenter="magnetize(link.from)"
      @end-mousedown="$event => dragstart(link.to, $event)"
      @end-mouseenter="magnetize(link.to)"
      @mouseout="unmagnetize()"
    />
  </g>
</template>