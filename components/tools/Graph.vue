<template>
  <svg class="nodes-graph">
    <g transform="translate(20 50)">
      <g v-for="link in links">
        <path :d="linkPath(link)" stroke="white" stroke-width="5" fill="transparent" />
      </g>
      <g v-for="n in nodes" :transform="`translate(${n.x} ${n.y})`">
        <rect :x="0" :y="0" width="200" height="50" fill="#555555" stroke="white" />
        <text x="10" y="15" dominant-baseline="middle" fill="white">{{ n.name }}</text>
        <text x="10" y="35" dominant-baseline="middle">{{ n.generator }}</text>
        <g v-for="(link, idx) in paramsLinksFor(n)">
          <rect x="20" :y="idx * 30 + 50" height="25" width="180" stroke="white" />
          <text x="30" :y="idx * 30 + 67" fill=white>{{ link.to.node }}</text>
        </g>
        <!--g v-for="(p, idx) in paramsForNode(n)">
          <rect x="20" :y="idx * 30 + 50" height="25" width="180" stroke="white" />
          <text x="30" :y="idx * 30 + 67" fill=white>{{ p.name }} :: {{ descriptor(p.descriptorId ?? '').field }}</text>
        </g-->
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
import { mapState } from 'pinia';
import IParameter from '~~/lib/interfaces/IParameter';
import ITool, { IToolParameter, InnerLink, InnerNode } from '~~/lib/interfaces/ITool';

const BEZIER_DX = 100;

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true,
    }
  },
  computed: {
    ...mapState(useDescriptors, ['parameters']),
    nodes(): InnerNode[] {
      return this.tool.nodes;
    },
    links(): InnerLink[] {
      return this.tool.links;
    },
    nodesLinks() {
      return this.links.filter((link: InnerLink) => link.to.node.match(/^[^.]*$/))
    },
    paramsLinks() {
      return this.links.filter((link: InnerLink) => !this.nodesLinks.includes(link));
    }
  },
  mounted() {
    useDescriptors().fetchDescriptors();
  },
  methods: {
    paramsLinksFor(n: InnerNode) {
      return this.paramsLinks.filter((l: InnerLink) => l.to.node.startsWith(n.name))
    },
    nodeByName(name: String): InnerNode {
      return find(this.nodes, (n: InnerNode) => n.name === name) as InnerNode;
    },
    paramsForNode(node: InnerNode) {
      return this.tool.parameters.filter((p: IToolParameter) => {
        return p.targets.includes(node.name);
      })
    },
    descriptor(id: string): IParameter {
      return this.parameters.find((d: IParameter) => d.id === id) as IParameter;
    },
    linkCoordinates(link: InnerLink) {
      const from = this.nodeByName(link.from.node);
      if (link.to.node.match(/^[^.]*$/)) {
        const to = this.nodeByName(link.to.node);
        return {
          x1: from.x + 200,
          y1: from.y + 25,
          x2: to.x,
          y2: to.y + 25
        }
      }
      else {
        const to = this.nodeByName(link.to.node.split('.')[0]);
        return {
          x1: from.x + 200,
          y1: from.y + 25,
          x2: to.x + 25,
          y2: to.y + 65
        }
      }
    },
    linkPath(link: InnerLink) {
      let { x1, y1, x2, y2 } = this.linkCoordinates(link);
      x1 = x1;
      x2 = x2 - 5;
      const bx = BEZIER_DX;
      const by = this.rightToLeft(link) ? - BEZIER_DX * 1.5 : 0;
      return `M ${x1} ${y1} C ${x1 + bx} ${y1 + by}, ${x2 - bx} ${y2 + by}, ${x2} ${y2}`
    },
    rightToLeft(link: InnerLink) {
      try {
        const to = (link.to.node.match(/^[^.]*$/)) ? link.to.node : link.to.node.split('.')[0];
        return this.nodeByName(link.from.node).x + 200 > this.nodeByName(to).x;
      }
      catch {
        return false;
      }
    },
    arrowPath(link: InnerLink) {
      const { x, y } = this.nodeByName(link.to.node);
      return `${x - 4} ${y - 4} l 8 4 l -8 4`
    },
  }
}
</script>

<style scoped>
.nodes-graph {
  width: 100%;
  height: 500px;
}
</style>