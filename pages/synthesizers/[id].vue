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
          @moved="move"
          @dropped="repositories.modules.update(module)"
        >
          <module v-if="!module.deleted" :module @deleted="deleteModule(module, cables)" @disconnected="disconnectModule(module, cables)">
            <template v-for="control in module.controls">
              <control-wrapper v-bind="{ control, module, synthesizer, ...props, ...control.payload }" />
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
import { createModule } from '~/utils/factories/modules';
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import { createCable } from '~/utils/factories/cables';
import type { AudioModule, Cable, Generator, LinkPayload, ModulePayload, Port, Synthesizer } from '~/types/Index';
import type { PlacedBox } from '~~/types/utils/PlacedBox';
import { disconnectModule, place } from '~/utils/functions/modules';
import { deleteModule } from '~/utils/functions/modules';
import { managers } from '~/lib/managers';
import { eventbus } from '~/lib/utils/eventbus/EventBus';
import type { Command } from '~/utils/functions/sse';
import { find } from 'lodash';

definePageMeta({ layout: false });

await loadProcessors(useAudio().context);

const id: string = useRoute().params.id as string;
const synthesizer: Ref<Synthesizer> = ref(await repositories.synthesizers.get(id));
const modules: Ref<Array<ModulePayload>> = ref(await repositories.modules.list(synthesizer.value));
const generators: Ref<Array<Generator>> = ref(await repositories.generators.list());
const links: Ref<Array<LinkPayload>> = ref(await repositories.links.list(synthesizer.value));

synthesizer.value.modules = await Promise.all(
  modules.value.map(async (payload: ModulePayload): Promise<AudioModule> => {
    return await createModule(payload, generators.value, synthesizer.value)
  })
);

const ports: ComputedRef<Array<Port>> = computed(() => {
  return synthesizer.value.modules.map((m: AudioModule) => m.ports).flat();
});

const cables: Ref<Array<Cable>> = ref(links.value.map((payload: LinkPayload) => {
  return createCable(payload.id, payload.from, payload.to, payload.color, ports.value);
}));

function onzoom(scale: number) {
  synthesizer.value.scale = scale;
}

function move({ x, y, id }: PlacedBox) {
  const found: AudioModule | undefined = synthesizer.value.modules.find((m: AudioModule) => m.id === id);
  if (!!found) place(found, y / RACK_HEIGHT, x / SLOT_SIZE);
}

const initialized: Ref<Boolean> = ref(false);

function initialize() {
  if (!initialized.value) {
    useAudio().context.resume();
    initialized.value = true;
  }
}

function addCable(cable: Cable) {
  cables.value.push(cable);
}

useCoordinates().setReference(synthesizer.value);

managers.midi.start();
managers.keyboard.start();

eventbus.subscribe('add.module', async (payload: ModulePayload & { synthesizer_id: string }) => {
  const idsMatch: boolean = payload.synthesizer_id === synthesizer.value.id;
  const moduleAlreadyExists: boolean = !!find(modules.value, { id: payload.id });
  if (idsMatch && !moduleAlreadyExists) {
    const instance: AudioModule = await createModule(payload, generators.value, synthesizer.value);
    synthesizer.value.modules.push(instance);
  }
})
</script>

<style scoped>
.full-size {
  width: 100vw;
  height: 100vh;
}
</style>