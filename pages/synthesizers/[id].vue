<template>
  <div @mousedown.capture="initialize" class="full-size">
    <synthesizer-menu :synthesizer="synthesizer"/>
    <stage
      v-if="synthesizer"
      :target="synthesizer"
      @zoom="onzoom"
      @panned="repositories.synthesizers.update(synthesizer)"
    >
      <template #background>
        <synthesizer-background :position="synthesizer" />
      </template>
      <template #default="{ props }">
        <stage-draggable
          v-for="module in synthesizer.modules"
          :collides-with="synthesizer.modules"
          v-bind="props"
          :target="module"
          :sx="SLOT_SIZE"
          :sy="RACK_HEIGHT"
          @moved="({ x, y }) => move(module, { x, y })"
          @dropped="() => save(module)"
        >
          <module v-if="!module.deleted" :module @deleted="() => deleteModule(module, cables)" @disconnected="disconnectModule(module, cables)">
            <template v-for="control in module.controls">
              <sp-control-wrapper v-bind="{ control, module, synthesizer, ...props, ...control.payload }" />
            </template>
          </module>
        </stage-draggable>
        <cable-list :cables="cables" :synthesizer="synthesizer" />
        <cable-creation v-if="useLinkCreation().displayed" @created="addCable" v-bind="props" :synthesizer="synthesizer" />
      </template>
    </stage>
  </div>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import { disconnectCable } from '~/utils/factories/cables';
import type { AudioModule, Cable, Generator, LinkPayload, ModulePayload, Port, Synthesizer } from '~/types/Index';
import { appendModule, appendModules, disconnectModule, place } from '~/utils/functions/modules';
import { deleteModule } from '~/utils/functions/modules';
import { managers } from '~/lib/managers';
import { eventbus } from '~/lib/utils/eventbus/EventBus';
import { find, remove } from 'lodash';
import type { Coordinates } from '~/types/utils/Coordinates';
import { appendCable, appendCables } from '~/utils/functions/cables';

definePageMeta({ layout: false });

await loadProcessors(useAudio().context);

const id: string = useRoute().params.id as string;
const synthesizer: Ref<Synthesizer> = ref(await repositories.synthesizers.get(id));
const modules: Ref<Array<ModulePayload>> = ref(await repositories.modules.list(synthesizer.value));
const generators: Ref<Array<Generator>> = ref(await repositories.generators.list());
const links: Ref<Array<LinkPayload>> = ref(await repositories.links.list(synthesizer.value));
const cables: Ref<Cable[]> = ref([]);

const ports: ComputedRef<Array<Port>> = computed(() => {
  return synthesizer.value.modules.map((m: AudioModule) => m.ports).flat();
});

await appendModules(synthesizer.value, modules.value, generators.value);
await appendCables(links.value, cables.value, ports.value);

function onzoom(scale: number) {
  synthesizer.value.scale = scale;
}

function move(module: AudioModule, { x, y }: Coordinates) {
  place(module, y / RACK_HEIGHT, x / SLOT_SIZE);
}

function save(module: AudioModule) {
  repositories.modules.update(module)
}

const initialized: Ref<Boolean> = ref(false);

function initialize() {
  if (!initialized.value) {
    useAudio().context.resume();
    initialized.value = true;
  }
}

function addCable(cable: Cable) {
  if (!find(cables.value, { id: cable.id })) cables.value.push(cable);
}

useCoordinates().setReference(synthesizer.value);

managers.midi.start();
managers.keyboard.start();

eventbus.subscribe(`${synthesizer.value.id}.add.module`, async (payload: ModulePayload) => {
  await appendModule(synthesizer.value, payload, generators.value);
});

eventbus.subscribe(`${synthesizer.value.id}.remove.module`, async (payload: ModulePayload) => {
  const found: AudioModule|undefined = find(synthesizer.value.modules, { id: payload.id });
  if (found) deleteModule(found, cables.value)
});

eventbus.subscribe(`${synthesizer.value.id}.update.module`, async (payload: ModulePayload) => {
  const found: AudioModule|undefined = find(synthesizer.value.modules, { id: payload.id });
  if (found) move(found, { x: payload.slot * SLOT_SIZE, y: payload.rack * RACK_HEIGHT });
});

eventbus.subscribe(`${synthesizer.value.id}.add.cable`, async(payload: LinkPayload) => {
  appendCable(payload, cables.value, ports.value);
});

eventbus.subscribe(`${synthesizer.value.id}.remove.cable`, (payload: LinkPayload) => {
  const found: Cable|undefined = find(cables.value, { id: payload.id });
  if (!found) return;
  disconnectCable(found);
  remove(cables.value, { id: found.id })
})

eventbus.subscribe(`remove.membership`, () => navigateTo('/synthesizers'));

managers.init(synthesizer.value);
</script>

<style scoped>
.full-size {
  width: 100vw;
  height: 100vh;
}
</style>