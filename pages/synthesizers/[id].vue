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
      @zoom="deltaY => zoomSynthesizer(synthesizer, deltaY)"
      @pan-released="(from, to) => panSynthesizer(synthesizer, from, to)"
    >
      <synthesizer-background />
      <sp-stage-svg-layer name="modules">
        <sp-stage-draggable
          v-for="module in modules"
          :target="module"
          :sx="SLOT_SIZE"
          :sy="RACK_HEIGHT"
          :accepts="position => acceptsModuleAt(module, position, modules)"
          @moved="() => syncModule(module)"
          @released="(from, to) => moveModuleAdapter(module, from, to, modules)"
        >
          <module v-if="!module.deleted" :module @deleted="onDeleted(module)" @disconnected="() => cablesAdapter.unplugModule(module)">
            <g v-for="control in module.controls" :transform="translate({ x: +(control.payload.x || 0), y: +(control.payload.y || 0)})">
              <sp-control-wrapper v-bind="{ control, module, synthesizer, ...control.payload }" />
            </g>
          </module>
        </sp-stage-draggable>
      </sp-stage-svg-layer>
      <sp-stage-svg-layer name="forefront" />
      <sp-stage-svg-layer name="cables">
        <cable-list :cables="cables" />
        <cable-creation v-if="cableDrag.step !== 'idle'" />
      </sp-stage-svg-layer>
    </sp-stage>
    <synthesizer-menu v-if="synthesizer.id" :synthesizer="synthesizer" :modules="modules" @created="createModule" @recenter="resetSynthesizer(synthesizer)" />
  </div>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import { RACK_HEIGHT, SLOT_SIZE } from "../../features/synthesizers/core/shared/Constants"
import type { AudioModule, Generator, ModulePayload, Synthesizer } from '~/types/Index';
import { appendModule } from '~/utils/functions/modules';
import { deleteModule } from '~/utils/functions/modules';
import { eventbus } from '~/utils/eventbus/EventBus';
import { find } from 'lodash';
import { translate } from "~/utils/functions/svg"
import { createModule as instanciateModule } from '~/utils/factories/modules';
import { useI18n } from 'vue-i18n';
import { panSynthesizer, resetSynthesizer, zoomSynthesizer } from '~/features/synthesizers/shell/legacy/viewport.adapter';
import { acceptsModuleAt, applyPlacement, moveModuleAdapter, syncModule } from '~/features/synthesizers/shell/legacy/module.adapter';
import { makeHub } from '~/features/midi/shell/hub';
import { CABLES, MIDI_HUB } from '~/features/synthesizers/shared/Constants';
import { startMidi, type MidiSession } from '~/features/midi/shell/session';
import type { MidiMessage } from '~/features/midi/core/data/MidiMessage.type';
import { type Cable } from "~/features/cables/core/data/Cable.type"
import type { CableDrag } from '~/features/cables/core/data/CableDrag.type';
import { IDLE_DRAG } from '~/features/cables/core/shared/Constants';
import { createCables } from '~/features/cables/shell/legacy/cables.adapter';
import { toObjectId } from '~/features/shared/data/ObjectId.type';

async function onDeleted(module: AudioModule) {
  await cablesAdapter.unplugModule(module)
  await deleteModule(module)
}

type PromisedRef<T> = Promise<Ref<T>>;

definePageMeta({ layout: false });

await loadProcessors(useAudio().context);

const hub = makeHub()

provide(MIDI_HUB, hub)

const midiLearn = useMidiLearn()

let session: MidiSession | null = null
let unlistenLearn = (): void => {}

onMounted(() => {
  session = startMidi({ navigator, window }, hub.emit)
  unlistenLearn = hub.listen((message: MidiMessage): void => { void midiLearn.receive(message) })
})

onBeforeUnmount(() => {
  session?.stop()
  session = null
  unlistenLearn()
  midiLearn.reset()
})

const id: string = useRoute().params.id as string;

async function loadSynthesizer(id: string): PromisedRef<Synthesizer> {
  return ref(await repositories.synthesizers.get(id))
}

async function loadGenerators(): PromisedRef<Generator[]> {
  return ref(await repositories.generators.list(useSession().token));
}

async function loadModules(id: string, generatorsPromise: PromisedRef<Generator[]>): PromisedRef<AudioModule[]> {
  const payloads: ModulePayload[] = await repositories.modules.list({ synthesizer_id: id });
  return ref(await Promise.all(payloads.map(async (payload: ModulePayload) => {
    return instanciateModule(payload, generatorsPromise)
  })))
}

async function loadCables(id: string) {
  return await repositories.links.list(id);
}

type LoaderKey = 'generators'|'modules'|'synthesizer'|'cables'
const loads: Ref<Record<LoaderKey, boolean>> = ref({
  generators: true,
  synthesizer: true,
  modules: true,
  cables: true,
})

function markedLoaded(key: LoaderKey): () => void {
  return () => {
    loads.value[key] = false;
  }
}

const generatorsPromise = loadGenerators().finally(markedLoaded('generators'))
const modulesPromise = loadModules(id, generatorsPromise).finally(markedLoaded('modules'))
const synthesizerPromise = loadSynthesizer(id).finally(markedLoaded('synthesizer'))
const cablespromise = loadCables(id).finally(markedLoaded('cables'))

const loadAll = Promise.all([
  generatorsPromise,
  synthesizerPromise,
  modulesPromise,
  cablespromise,
]);

const synthesizer: Ref<Synthesizer> = ref(createEmptySynthesizer());
const modules: Ref<AudioModule[]> = ref([]);
const cables: Ref<Cable[]> = ref([]);
const cableDrag: Ref<CableDrag> = ref(IDLE_DRAG)
const cablesAdapter = createCables(toObjectId(id), () => modules.value, cables, cableDrag)
provide(CABLES, cablesAdapter)

const loading = ref(true);

loadAll.then(async ([ _, synth, mods, links ]) => {
  synthesizer.value = synth.value;
  modules.value = mods.value;
  await cablesAdapter.load(links)

  useCoordinates().setReference(synthesizer.value);

  // This little timeout is just here so that every "loaded OK" has the time to be seen.
  setTimeout(() => { loading.value = false; }, 100);

  eventbus.subscribe(`${synthesizer.value.id}.add.module`, createModule);
  eventbus.subscribe(`${synthesizer.value.id}.remove.module`, removeModule);
  eventbus.subscribe(`${synthesizer.value.id}.update.module`, updateModule);
  eventbus.subscribe(`${synthesizer.value.id}.add.cable`, cablesAdapter.receiveAdded);
  eventbus.subscribe(`${synthesizer.value.id}.remove.cable`, cablesAdapter.receiveRemoved)
})

async function createModule (payload: ModulePayload) {
  await appendModule(await modulesPromise, payload, generatorsPromise);
}

function updateModule(payload: ModulePayload) {
  const found: AudioModule|undefined = find(synthesizer.value.modules, { id: payload.id });
  if (found) applyPlacement(found, { rack: payload.rack, slot: payload.slot })
}

async function removeModule (payload: ModulePayload) {
  const found: AudioModule|undefined = find(modules.value, { id: payload.id });
  if (found) await onDeleted(found)
}

const initialized: Ref<boolean> = ref(false);

function initialize() {
  if (!initialized.value) {
    useAudio().context.resume();
    initialized.value = true;
  }
}

eventbus.subscribe("remove.membership", () => navigateTo('/synthesizers'));
</script>

<style scoped>
.full-size {
  width: 100vw;
  height: 100vh;
}
</style>