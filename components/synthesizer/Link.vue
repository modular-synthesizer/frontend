<script lang="ts">
import { mapActions } from "pinia";
import { PORT_RADIUS } from "~~/lib/utils/constants";
import Link from "~~/lib/wrappers/Link";

export default {
  props: {
    link: {
      type: Link,
      required: true
    }
  },
  computed: {
    r(): number {
        return PORT_RADIUS - 3
    },
  },
  methods: {
    ...mapActions(useLinksList, ['remove']),
    ...mapActions(useLinkDrag, ['dragstart', 'dragend', 'magnetize', 'unmagnetize']),
  }
}
</script>

<template>
    <g>
        <line
            :x1="link.from.ax"
            :x2="link.to.ax"
            :y1="link.from.ay"
            :y2="link.to.ay"
            :stroke="link.color"
            stroke-width="8"
            opacity="0.3"
            @click.prevent="remove(link.id)"

        />
        <circle
            :cx="link.from.ax"
            :cy="link.from.ay"
            :r="r"
            :stroke="link.color"
            stroke-width="6"
            fill="white"
            stroke-alignment="inner"
            @click.prevent="remove(link.id)"
            @mousedown.left.stop="dragstart(link.from, $event)"
            @mouseenter="magnetize(link.from)"
            @mouseout="unmagnetize()"
        />
        <circle
            :cx="link.to.ax"
            :cy="link.to.ay"
            :r="r"
            :stroke="link.color"
            stroke-width="6"
            fill="white"
            stroke-alignment="inner"
            @click.prevent="remove(link.id)"
            @mousedown.left.stop="dragstart(link.to, $event)"
            @mouseenter="magnetize(link.to)"
            @mouseout="unmagnetize()"
        />
    </g>
</template>