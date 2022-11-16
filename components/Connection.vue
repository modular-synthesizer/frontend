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
    x1(): number {
        return this.link.from.ax
    },

    r(): number {
        return PORT_RADIUS - 3
    },

    y1(): number {
        return this.link.from.ay
    },

    y2(): number {
        return this.link.to.ay
    },

    x2(): number {
        return this.link.to.ax
    }
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
            :x1="x1"
            :x2="x2"
            :y1="y1"
            :y2="y2"
            :stroke="link.color"
            stroke-width="8"
            opacity="0.3"
            @click="removeLink(link)"

        />
        <circle
            :cx="x1"
            :cy="y1"
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
            :cx="x2"
            :cy="y2"
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