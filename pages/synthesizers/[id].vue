<template>
  <div @mousedown.capture="initialize" class="full-size">
    <synthesizer-menu :synthesizer="synthesizer"/>
    <stage v-if="synthesizer" :target="synthesizer" @zoom="onzoom" @panned="save">
      <template #default="{ props }">
        <stage-draggable v-for="module in synthesizer.modules" :collides-with="synthesizer.modules" v-bind="props" :target="module" :sx="SLOT_SIZE" :sy="RACK_HEIGHT" @moved="move" @dropped="saveModule(module)">
          <module :module>
            <template v-for="control in module.controls">
              <control-wrapper v-bind="{ control, module, synthesizer, ...props }" />
            </template>
          </module>
        </stage-draggable>
        <cable-list :cables="cables" :synthesizer="synthesizer" />
        <cable v-if="useLinkCreation().displayed" :start="useLinkCreation().origin" :end="useLinkCreation().destination" :no-events="true" color="red" />
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
import { place } from '~/utils/functions/modules';

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

function save() {
  repositories.synthesizers.update(synthesizer.value);
}

function move(module: PlacedBox) {
  const found: AudioModule | undefined = synthesizer.value.modules.find((m: AudioModule) => m.id === module.id);
  if (found !== undefined) {
    place(found, module.y / RACK_HEIGHT, module.x / SLOT_SIZE);
  }
}

function saveModule(module: AudioModule) {
  repositories.modules.update(module);
}

const initialized: Ref<Boolean> = ref(false);

function initialize() {
  if (!initialized.value) {
    useAudio().context.resume();
    initialized.value = true;
  }
}

useCoordinates().setSynthesizer(synthesizer.value);
</script>

<style scoped>
.full-size {
  width: 100vw;
  height: 100hv;
}
</style>