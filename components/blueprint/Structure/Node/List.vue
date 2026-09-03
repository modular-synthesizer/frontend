<template>
  <template v-for="node in blueprint.nodes">
    <blueprint-structure-node
      v-if="node.id !== selection.item?.id"
      :node="node"
      :selected="false"
      @select="selection.select(node)"
      :blueprint="blueprint"
      @edit-port="editPort"
    />
  </template>
  <blueprint-structure-node
    v-if="selection.item"
    :node="selection.item"
    :selected="true"
    :blueprint="blueprint"
    @edit-port="editPort"
  />
</template>

<script lang="ts" setup>
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { ToolPort } from '~~/types/blueprints/Port';
import { repositories } from '~/lib/repositories';
import type { InnerNode } from '~/types/blueprints/InnerNode'
import { find } from 'lodash';

const { blueprint } = defineProps({
  blueprint: { type: Object as PropType<Blueprint>, required: true }
});

const selection = ref(useSelectables().state.value.nodes);

const emit = defineEmits<{ editPort: [ item: ToolPort ] }>();

function editPort(port: ToolPort) {
  emit('editPort', port)
}

const keys: Record<string, [number, number]> = { Right: [20, 0], Left: [-20, 0], Down: [0, 20], Up: [0, -20] }
Object.keys(keys).forEach((k: string) => {
  useKeyboardEvents().keydown(`Arrow${k}`, () => {
    if (selection.value.item === undefined) return;
    const item: InnerNode | undefined = find(blueprint.nodes, { id: selection.value.item.id });
    if (item === undefined) return;
    item.x += keys[k][0]; item.y += keys[k][1];
    debounce(item.id, 500, () => repositories.blueprint.nodes.update(blueprint, blueprint.nodes, item));
  });
});
</script>