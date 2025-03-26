<template>
  <v-layout class="d-flex flex-column justify-center align-center" v-if="loading">
    <v-progress-circular indeterminate size="80" class="mb-5" />
    <div>Chargement des générateurs... <span class="text-green" v-if="!loads.generators">OK</span></div>
    <div>Chargement du synthétiseur... <span class="text-green" v-if="!loads.synthesizer">OK</span></div>
    <div>Chargement des modules... <span class="text-green" v-if="!loads.modules">OK</span></div>
    <div>Chargement des cables... <span class="text-green" v-if="!loads.cables">OK</span></div>
    <div>Chargement des ports... <span class="text-green" v-if="!loads.ports">OK</span></div>
  </v-layout>
  <div v-else @mousedown.capture="initialize" class="full-size">
    <synthesizer-menu :synthesizer="synthesizer"/>
    <sp-stage
      v-if="synthesizer"
      :target="synthesizer"
      @zoom="onzoom"
      @panned="repositories.synthesizers.update(synthesizer)"
    >
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
  </div>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import { createCable, disconnectCable } from '~/utils/factories/cables';
import type { AudioModule, Cable, Generator, LinkPayload, ModulePayload, Port, Synthesizer } from '~/types/Index';
import { appendModule, disconnectModule, place } from '~/utils/functions/modules';
import { deleteModule } from '~/utils/functions/modules';
import { managers } from '~/lib/managers';
import { eventbus } from '~/lib/utils/eventbus/EventBus';
import { find, pick, remove } from 'lodash';
import type { Coordinates } from '~/types/utils/Coordinates';
import { appendCable } from '~/utils/functions/cables';
import { translate } from "~/utils/functions/svg"
import { createModule } from '~/utils/factories/modules';

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
    return createModule(payload, generatorsPromise)
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

const loads: Ref<Record<string, boolean>> = ref({
  generators: true,
  modules: true,
  synthesizer: true,
  cables: true,
  ports: true,
})

const generatorsPromise = loadGenerators().then((generators) => {
  loads.value.generators = false
  return generators
})
const modulesPromise = loadModules(id, generatorsPromise).then((modules) => {
  loads.value.modules = false
  return modules
})
const synthesizerPromise = loadSynthesizer(id).then((synth) => {
  loads.value.synthesizer = false
  return synth
})
const cablespromise = loadCables(id, modulesPromise).then((cables) => {
  loads.value.cables = false
  return cables
})
const portsPromise = loadPorts(modulesPromise).then((ports) => {
  loads.value.ports = false
  return ports
})

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
  setTimeout(() => {
    loading.value = false;
  }, 100)
  
})

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

function addCable(cable: Cable) {
  if (cable === undefined) return;
  
  if (!find(cables.value, { id: cable.id })) cables.value.push(cable);
}

useCoordinates().setReference(synthesizer.value);

managers.midi.start();
managers.keyboard.start();

eventbus.subscribe(`${synthesizer.value.id}.add.module`, async (payload: ModulePayload) => {
  await appendModule(await modulesPromise, payload, generatorsPromise);
});

eventbus.subscribe(`${synthesizer.value.id}.remove.module`, async (payload: ModulePayload) => {
  const found: AudioModule|undefined = find(modules.value, { id: payload.id });
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

eventbus.subscribe("remove.membership", () => navigateTo('/synthesizers'));

managers.init(synthesizer.value);
</script>

<style scoped>
.full-size {
  width: 100vw;
  height: 100vh;
}
</style>