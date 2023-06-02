<template>
  <svg class="nodes-graph">
    <g transform="translate(20 50)">
      <g v-for="link in nodesLinks">
        <path :d="linkPath(link)" stroke="white" stroke-width="5" fill="transparent" />
      </g>
      <g v-for="n in nodes" :transform="`translate(${n.x} ${n.y})`">
        <rect :x="0" :y="0" width="200" height="50" fill="#555555" stroke="white" />
        <text x="10" y="15" dominant-baseline="middle" fill="white">{{ n.name }}</text>
        <text x="10" y="35" dominant-baseline="middle">{{ n.generator }}</text>
      </g>
      <g v-for="link in nodesLinks">
        <circle
          :cx="nodeByName(link.to.node).x"
          :cy="nodeByName(link.to.node).y + 25"
          fill="black" r="6" stroke="white" stroke-width="3"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { find } from 'lodash';
import ITool, { InnerLink, InnerNode } from '~~/lib/interfaces/ITool';

const BEZIER_DX = 100;

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true,
    }
  },
  computed: {
    nodes(): InnerNode[] {
      return this.tool.nodes;
    },
    links(): InnerLink[] {
      return this.tool.links;
    },
    nodesLinks() {
      return this.links.filter((link: InnerLink) => link.to.node.match(/^[^.]*$/))
    }
  },
  methods: {
    nodeByName(name: String): InnerNode {
      return find(this.nodes, (n: InnerNode) => n.name === name) as InnerNode;
    },
    linkCoordinates(link: InnerLink) {
      const from = this.nodeByName(link.from.node);
      const to = this.nodeByName(link.to.node);
      return {
        x1: from.x + 200,
        y1: from.y + 25,
        x2: to.x,
        y2: to.y + 25
      }
    },
    linkPath(link: InnerLink) {
      let { x1, y1, x2, y2 } = this.linkCoordinates(link);
      x1 = x1;
      x2 = x2 - 5;
      const bx = BEZIER_DX;
      const by = this.rightToLeft(link) ? BEZIER_DX * 1.5 : 0;
      return `M ${x1} ${y1} C ${x1 + bx} ${y1 + by}, ${x2 - bx} ${y2 + by}, ${x2} ${y2}`
    },
    rightToLeft(link: InnerLink) {
      return this.nodeByName(link.from.node).x + 200 > this.nodeByName(link.to.node).x
    },
    arrowPath(link: InnerLink) {
      const { x, y } = this.nodeByName(link.to.node);
      return `${x - 4} ${y - 4} l 8 4 l -8 4`
    }
  }
}
</script>

<style scoped>
.nodes-graph {
  width: 100%;
  height: 500px;
}
</style>