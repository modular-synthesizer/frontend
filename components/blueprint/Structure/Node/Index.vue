<template>
  <g @click.right.prevent.stop="openMenu">
    <rect :height="getNodeHeight(node, blueprint)" width="180" fill="black" stroke="white" />
    <text x="10" y="20" fill="white">{{ node.name }}</text>
    <g v-for="(param, i) in parametersFor(node, blueprint)" :transform="`translate(10, ${(i * PARAM_HEIGHT) + TITLE_HEIGHT})`">
      <blueprint-structure-param :param="param" :blueprint="blueprint" :node="node" />
    </g>
    <rect
      :height="getNodeHeight(node, blueprint)"
      width="180"
      fill="transparent"
      stroke="red"
      stroke-width="5"
      v-if="$props.selected"
      class="selected-stroke"
    />
    <circle v-for="idx in maxIndexTo(node, blueprint)" cx="0" :cy="20 * idx" :r="PORT_RADIUS" fill="white" />
    <circle v-for="idx in maxIndexFrom(node, blueprint)" cx="180" :cy="20 * idx" :r="PORT_RADIUS" fill="white" />
  </g>
</template>

<script setup lang="ts">
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { ToolPort } from '~~/types/blueprints/Port';
import type { InnerNode } from '~~/types/blueprints/InnerNode';

const props = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false},
  blueprint: { type: Object as PropType<Blueprint>, required: true }
});

const emit = defineEmits<{
  select: [item: InnerNode],
  moveSelected: [x: number, y: number],
  editPort: [ item: ToolPort ]
}>();

function openMenu($event: MouseEvent) {
  emit('select', props.node);
  useContexts().display($event, {
    items: [
      {
        label: 'Supprimer', action() {
          useSelectables().state.value.nodes.delete(props.blueprint);
        }
      }
    ]
  })
}
</script>

<style scoped>
.close {
  font-size: 24px;
  cursor: pointer;
}
.selected-stroke {
  pointer-events: none;
}
</style>