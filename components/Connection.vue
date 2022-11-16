<script lang="ts">
import { mapActions } from "pinia";
import { useLinkDrag } from "~~/lib/stores/links/dragAndDrop";
import { useLinksList } from "~~/lib/stores/links/linksList";
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
    ...mapActions(useLinksList, ['removeLink']),
    ...mapActions(useLinkDrag, ['startLinkFrom', 'endLinkTo', 'magnetize', 'unmagnetize']),
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
            @click="removeLink(link)"

        />
        <circle
            :cx="link.from.ax"
            :cy="link.from.ay"
            :r="r"
            :stroke="link.color"
            stroke-width="6"
            fill="white"
            stroke-alignment="inner"
            @click="removeLink(link)"
            @mousedown.left.stop="startLinkFrom(link.from)"
            @mouseenter="magnetize(link.from)"
            @mouseup="endLinkTo(link.from)"
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
            @click="removeLink(link)"
            @mousedown.left.stop="startLinkFrom(link.to)"
            @mouseenter="magnetize(link.to)"
            @mouseup="endLinkTo(link.to)"
            @mouseout="unmagnetize()"
        />
    </g>
</template>