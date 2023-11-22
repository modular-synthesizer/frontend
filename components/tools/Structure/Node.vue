<template>
  <g v-if="node" :transform="`translate(${node.x} ${node.y})`">
    <foreignObject :height="wrapperHeight" width="150">
      <div class="node-wrapper" :style="{ height: `${height}px` }">
        <span class="node-name">{{ node.name }}</span>
        <span class="node-generator">{{ node.generator }}</span>
      </div>
      <div class="node-parameter" v-for="p in parameters">
        {{  p.name }}
      </div>
    </foreignObject>
    <circle v-for="idx in outputs" :r="10" fill="black" stroke="white" :cy="(idx - 1) * 25 + 15" :cx="150" />
    <circle v-for="idx in inputs" :r="10" fill="black" stroke="white" :cy="(idx - 1) * 25 + 15" :cx="0" />
  </g>
</template>

<script lang="ts">
import ITool, { IToolParameter, InnerLink, InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    node: {
      type: Object as PropType<InnerNode>,
      required: true
    },
    modelValue: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  computed: {
    tool(): ITool {
      return this.modelValue
    },
    nodes(): InnerNode[] {
      return this.tool.nodes;
    },
    links(): InnerLink[] {
      return this.tool.links;
    },
    parameters(): IToolParameter[] {
      return this.tool.parameters.filter((p: IToolParameter) => {
        return p.targets.includes(this.node.name)
      });
    },
    outputs(): number {
      const links: InnerLink[] = this.links.filter((l: InnerLink) => {
        return l.from.node === this.node.name ;
      });
      return Math.max(Math.max(...links.map(l => l.from.index)) + 1, 0);
    },
    inputs(): number {
      const links: InnerLink[] = this.links.filter((l: InnerLink) => {
        return l.to.node === this.node.name;
      });
      return Math.max(Math.max(...links.map(l => l.to.index)) + 1, 0);
    },
    height(): number {
      const outputs: number = this.outputs;
      return outputs === 0 ? 50 : 25 * (outputs + 1);
    },
    wrapperHeight(): number {
      return this.height + this.parameters.length * 30
    }
  }
};
</script>

<style scoped>
svg {
  margin-top: 20px;
  width: 100%;
  height: 400px;
}
foreignObject {
  overflow: visible;
}
.node-name, .node-generator {
  display: block;
}
.node-generator {
  font-style: italic;
  color: silver;
  font-size: 12px;
}
.node-parameter {
  width: 100px;
  border-top: none!important;
}
.node-wrapper, .node-parameter {
  padding: 3px 6px 3px 12px;
  border: 1px solid white;
}
</style>