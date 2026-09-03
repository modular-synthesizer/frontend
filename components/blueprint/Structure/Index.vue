<template>
  <sp-stage :target="referential" @click="useSelectables().reset" @panned="c => emit('panned', c)">
    <sp-stage-svg-layer name="blueprint">
      <sp-stage-draggable v-for="node in blueprint.nodes" :target="node" :sx="10" :sy="10" @dropped="b => emit('moved', b)">
        <blueprint-structure-node
          :node="node"
          :selected="false"
          :blueprint="blueprint"
        />
      </sp-stage-draggable>
      <blueprint-structure-link-list :blueprint="blueprint" />
      <blueprint-structure-port-list :ports="blueprint.ports" :blueprint="blueprint" @edit="editPort" />
    </sp-stage-svg-layer>
  </sp-stage>
  <blueprint-structure-dialogs-port
    v-if="p !== null"
    :port="p"
    :blueprint="blueprint"
    v-model="dialog"
    @cancelled="dialog = false"
    @validated="validateEditPort"
  />
</template>

<script setup lang="ts">
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { ToolPort } from '~~/types/blueprints/Port';
import type { Coordinates, ScaledCoordinates } from '~/types/utils/Coordinates';
import { cloneDeep } from 'lodash';
import { repositories } from '~/lib/repositories';

const { blueprint } = defineProps({
  blueprint: { type: Object as PropType<Blueprint>, required: true }
});

type Emits = { moved: [ PlacedBox ], panned: [ Coordinates ] };
const emit = defineEmits<Emits>();

const referential: Ref<ScaledCoordinates> = ref(blueprint)

const p: Ref<ToolPort|null> = ref(null);
const dialog: Ref<boolean> = ref(false);

function editPort(port: ToolPort) {
  p.value = cloneDeep(port)
  dialog.value = true;
}

async function validateEditPort(port: ToolPort) {
  await repositories.blueprint.ports.update(blueprint, port);
  p.value = null;
  dialog.value = false;
}

useKeyboardEvents().keydown('Delete', () => {
  useSelectables().delete(blueprint);
})
</script>

<style scoped>
.super-wrapper > header {
  border: 1px solid white;
  border-bottom: none;
}

svg {
  height: calc(100vh - 48px);
  width: 100%;
}
</style>