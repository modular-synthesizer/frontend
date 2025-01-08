<template>
  <stage v-if="synthesizer" :target="synthesizer" @zoom="onzoom" @panned="save" @strategy-changed="onstrategychange">
    <template #default="{ props: { click } }">
      <draggable-module v-for="module in synthesizer.modules" v-bind="{ click, module }" :sx="SLOT_SIZE" :sy="RACK_HEIGHT" @moved="move">
        <module :module="module">
          <template v-for="control in module.controls">
            <control-port
              v-if="control.component === 'Port'"
              v-bind="{ control, module, synthesizer, click }"
              @mouseenter="magnetize(module, control)"
              @mouseout="unmagnetize()"
              @link-created="createLink"
            />
            <control-small-knob v-if="control.component === 'SmallKnob'" v-bind="{ control, module, synthesizer, click }" />
          </template>
        </module>
      </draggable-module>
      <cable-list :cables="cables" :synthesizer="synthesizer" />
      <cable v-if="linking" :start="linkStrategy.origin" :end="linkStrategy.destination" :no-events="true" color="red" />
    </template>
  </stage>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import type { AudioModule, ModulePayload } from '~/types/modules/AudioModule';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { createModule } from '~/utils/factories/modules';
import type { Generator } from '~/types/Generator';
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import type { Cable, LinkPayload } from '~/types/Cable';
import type { Draggable } from '~/types/utils/Coordinates';
import type { IStrategy } from '~/utils/draggables/IStrategy';
import type { LinkCreationStrategy } from '~/utils/draggables/LinkCreationStrategy';
import type { Control } from '~/types/tools/Control';
import type { Port } from '~/types/modules/Port';
import { createCable } from '~/utils/factories/cables';
import { isInput } from '~/utils/functions/ports';

definePageMeta({ layout: false })

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

function move(module: Draggable) {
  const found: AudioModule | undefined = synthesizer.value.modules.find((m: AudioModule) => m.id === module.id);
  if (found !== undefined) {
    found.slot = module.x / SLOT_SIZE;
    found.rack = module.y / RACK_HEIGHT;
  }
}

const linking: Ref<Boolean> = ref(false);

const strategy: Ref<IStrategy> = ref(null as unknown as IStrategy);

const linkStrategy: ComputedRef<LinkCreationStrategy> = computed(() => strategy.value as LinkCreationStrategy);

function onstrategychange(value: IStrategy) {
  linking.value = (value.constructor.name === 'LinkCreationStrategy');
  strategy.value = value;
}

function magnetize(module: AudioModule, control: Control) {
  if (!linking.value) return;
  const port: Port | undefined = module.ports.find((p: Port) => p.name === control.payload.target);
  if (port === undefined || linkStrategy.value.port.kind === port.kind) return;
  linkStrategy.value.magnetize(port);
}

function unmagnetize() {
  if (!linking.value) return;
  linkStrategy.value.unmagnetize();
}

async function createLink(origin: Port, destination: Port) {
  if (!origin || !destination) return
  const from = isInput(destination) ? origin : destination;
  const to = isInput(origin) ? origin : destination;
  
  const insertion: Cable = createCable('', from.id, to.id, 'red', ports.value);
  cables.value.push(insertion);

  const payload = {
    id: '',
    from: from.id,
    to: to.id,
    synthesizer_id: synthesizer.value.id,
    color: 'red'
  }
  insertion.id = (await repositories.links.create(payload)).id;
}
</script>