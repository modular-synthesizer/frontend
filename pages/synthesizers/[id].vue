<template>
  <v-layout class="d-flex flex-column justify-center align-center" v-if="loading">
    <v-progress-circular indeterminate size="80" class="mb-8" />
    <div>
      <div class="d-flex" v-for="(loader, name) in loads">
        <div class="flex-0-1 pr-8">{{ useI18n().t(`synthesizers.loader.${name}`) }}</div>
        <div class="flex-1-0 text-right text-green" v-if="!loader">OK</div>
      </div>
    </div>
  </v-layout>
  <div v-else @mousedown.capture="initialize" class="full-size">
    <sp-stage
      v-if="synthesizer"
      :target="synthesizer"
      @zoom="onzoom"
      @panned="repositories.synthesizers.update(synthesizer)"
    >
      <synthesizer-background />
      <sp-stage-svg-layer name="modules">
        <sp-stage-draggable
          v-for="module in modules"
          :collides-with="modules"
          :target="module"
          :sx="SLOT_SIZE"
          :sy="RACK_HEIGHT"
          @moved="({ x, y }) => move(module, { x, y })"
          @dropped="() => save(module)"
        >
          <module v-if="!module.deleted" :module @deleted="() => deleteModule(module, cables)" @disconnected="disconnectModule(module, cables)">
            <g v-for="control in module.controls" :transform="translate({ x: +control.payload.x, y: +control.payload.y})">
              <sp-control-wrapper v-bind="{ control, module, synthesizer, ...control.payload }" />
            </g>
          </module>
        </sp-stage-draggable>
      </sp-stage-svg-layer>
      <sp-stage-svg-layer name="cables">
        <cable-list :cables="cables" :synthesizer="synthesizer" />
        <cable-creation v-if="useLinkCreation().displayed" @created="addCable" :synthesizer="synthesizer" />
      </sp-stage-svg-layer>
      <sp-stage-svg-layer name="forefront" />
    </sp-stage>
    <synthesizer-menu v-if="synthesizer.id" :synthesizer="synthesizer" @created="createModule" />
  </div>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import { RACK_HEIGHT, SLOT_SIZE } from '~/utils/constants';
import { createCable, disconnectCable } from '~/utils/factories/cables';
import type { AudioModule, Cable, Generator, LinkPayload, ModulePayload, Port, Synthesizer } from '~/types/Index';
import { appendModule, disconnectModule, place } from '~/utils/functions/modules';
import { deleteModule } from '~/utils/functions/modules';
import { initManagers, managers } from '~/utils/midi';
import { eventbus } from '~/utils/eventbus/EventBus';
import { find, pick } from 'lodash';
import type { Coordinates } from '~/types/utils/Coordinates';
import { appendCable } from '~/utils/functions/cables';
import { translate } from "~/utils/functions/svg"
import { createModule as instanciateModule } from '~/utils/factories/modules';
import type { Identified } from '@jsynple/core';
import { useI18n } from 'vue-i18n';

type PromisedRef<T> = Promise<Ref<T>>;

definePageMeta({ layout: false });

await loadProcessors(useAudio().context);

const id: string = useRoute().params.id as string;

async function loadSynthesizer(id: string): PromisedRef<Synthesizer> {
  return ref(await repositories.synthesizers.get(id, useSession().token))
}

async function loadGenerators(): PromisedRef<Generator[]> {
  return ref(await repositories.generators.list(useSession().token));
}

async function loadModules(id: string, generatorsPromise: PromisedRef<Generator[]>): PromisedRef<AudioModule[]> {
  const payloads: ModulePayload[] = await repositories.modules.list(useSession().token, { id });
  return ref(await Promise.all(payloads.map(async (payload: ModulePayload) => {
    return instanciateModule(payload, generatorsPromise)
  })))
}

async function loadCables(id: string, modulesPromise: PromisedRef<AudioModule[]>): PromisedRef<Cable[]> {
  const payloads: LinkPayload[] = await repositories.links.list(id);
  const ports = (await modulesPromise).value.flatMap((m: AudioModule) => m.ports)
  return ref(payloads.map((payload: LinkPayload) => {
    return createCable(payload.id, payload.from, payload.to, payload.color, ports);
  }))
}

async function loadPorts(modulesPromise: PromisedRef<AudioModule[]>): PromisedRef<Port[]> {
  const modules: AudioModule[] = (await modulesPromise).value;
  return ref(modules.flatMap((m: AudioModule) => m.ports));
}

type LoaderKey = 'generators'|'modules'|'synthesizer'|'cables'|'ports'
const loads: Ref<Record<LoaderKey, boolean>> = ref({
  generators: true,
  synthesizer: true,
  modules: true,
  cables: true,
  ports: true,
})

function markedLoaded(key: LoaderKey): () => void {
  return () => {
    loads.value[key] = false;
  }
}

const generatorsPromise = loadGenerators().finally(markedLoaded('generators'))
const modulesPromise = loadModules(id, generatorsPromise).finally(markedLoaded('modules'))
const synthesizerPromise = loadSynthesizer(id).finally(markedLoaded('synthesizer'))
const cablespromise = loadCables(id, modulesPromise).finally(markedLoaded('cables'))
const portsPromise = loadPorts(modulesPromise).finally(markedLoaded('ports'))

const loadAll = Promise.all([
  generatorsPromise,
  synthesizerPromise,
  modulesPromise,
  cablespromise,
  portsPromise
]);

const synthesizer: Ref<Synthesizer> = ref(createEmptySynthesizer());
const modules: Ref<AudioModule[]> = ref([]);
const cables: Ref<Cable[]> = ref([]);
const ports: Ref<Port[]> = ref([])

const loading = ref(true);

loadAll.then(([ _, synth, mods, links, ps ]) => {
  synthesizer.value = synth.value;
  modules.value = mods.value;
  cables.value = links.value;
  ports.value = ps.value;

  initManagers(synthesizer.value);

  useCoordinates().setReference(synthesizer.value);

  // This little timeout is just here so that every "loaded OK" has the time to be seen.
  setTimeout(() => { loading.value = false; }, 100);

  eventbus.subscribe(`${synthesizer.value.id}.add.module`, createModule);
  eventbus.subscribe(`${synthesizer.value.id}.remove.module`, removeModule);
  eventbus.subscribe(`${synthesizer.value.id}.update.module`, updateModule);
  eventbus.subscribe(`${synthesizer.value.id}.add.cable`, createcable);
  eventbus.subscribe(`${synthesizer.value.id}.remove.cable`, removeCable)
})

async function createModule (payload: ModulePayload) {
  await appendModule(await modulesPromise, payload, generatorsPromise);
}

function updateModule(payload: ModulePayload) {
  const found: AudioModule|undefined = find(synthesizer.value.modules, { id: payload.id });
  if (found) move(found, { x: payload.slot * SLOT_SIZE, y: payload.rack * RACK_HEIGHT });
}

function removeIfFound<T extends Identified, Item extends Identified>(list: T[], item: Item) {
  const index: number = list.findIndex((i: T) => i.id === item.id);
  const found = list[index]
  if (index >= 0) list.splice(index, 1);
  return found;
}

function removeCable(payload: LinkPayload) {
  disconnectCable(removeIfFound(cables.value, payload));
}

function removeModule (payload: ModulePayload) {
  const found: AudioModule|undefined = find(modules.value, { id: payload.id });
  if (found) deleteModule(found, cables.value)
}

function onzoom(scale: number) {
  synthesizer.value.scale = scale;
}

function move(module: AudioModule, { x, y }: Coordinates) {
  place(module, y / RACK_HEIGHT, x / SLOT_SIZE);
}

function save(module: AudioModule) {
  repositories.modules.update(pick(module, [ 'id', 'rack', 'slot' ]), useSession().token)
}

const initialized: Ref<boolean> = ref(false);

function initialize() {
  if (!initialized.value) {
    useAudio().context.resume();
    initialized.value = true;
  }
}

function createcable(payload: LinkPayload) {
  appendCable(payload, cables.value, ports.value);
}

function addCable(cable: Cable) {
  if (cable === undefined) return;
  if (!find(cables.value, { id: cable.id })) cables.value.push(cable);
}

managers.midi.start();
managers.keyboard.start();

eventbus.subscribe("remove.membership", () => navigateTo('/synthesizers'));
</script>

<style scoped>
.full-size {
  width: 100vw;
  height: 100vh;
}
</style>