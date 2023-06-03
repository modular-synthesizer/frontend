<template>
  <svg class="nodes-graph" :style="{'height': maxHeight, 'width': '100%'}">
    <g transform="translate(20 50)">
      <g v-for="link in graph.links">
        <path :d="linkPath(link)" stroke="white" stroke-width="5" fill="transparent" />
      </g>
      <g v-for="n in graph.nodes">
        <rect :x="n.x" :y="n.y" width="200" height="50" fill="#555555" stroke="white" />
        <text :x="n.x + 10" :y="n.y + 15" dominant-baseline="middle" fill="white">{{ n.label }}</text>
        <text :x="n.x + 10" :y="n.y + 35" dominant-baseline="middle" fill="#BBBBBB">{{ n.subtitle }}</text>
        <g v-for="param in n.parameters">
          <rect :x="param.x" :y="param.y" height="30" width="180" stroke="white" />
          <text :x="param.x + 10" :y="param.y + 20" fill="white">{{ param.label }}</text>
        </g>
      </g>
      <g v-for="link in graph.links">
        <circle :cx="link.x2" :cy="link.y2" fill="black" r="6" stroke="white" stroke-width="3" />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import ITool from '~~/lib/interfaces/ITool';
import IGraph from '~~/lib/interfaces/toolGraph/IGraph';
import IGraphLink from '~~/lib/interfaces/toolGraph/IGraphLink';

const BEZIER_DX = 100;

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true,
    }
  },
  data() {
    return {
      graph: { nodes: [], links: [] } as IGraph
    };
  },
  async beforeMount() {
    this.graph = await createGraph(this.tool)
  },
  computed: {
    maxHeight(): string {
      return "700px";
    }
  },
  methods: {
    linkPath(link: IGraphLink) {
      let { x1, y1, x2, y2 } = link;
      x1 = x1;
      x2 = x2 - 5;
      const bx = BEZIER_DX;
      const by = x1 > x2 ? - BEZIER_DX * 1.5 : 0;
      return `M ${x1} ${y1} C ${x1 + bx} ${y1 + by}, ${x2 - bx} ${y2 + by}, ${x2} ${y2}`
    },
  }
}
</script>