<template>
  <stage v-if="synthesizer" :target="synthesizer" @zoom="onzoom" @panned="save" @strategy-changed="onstrategychange">
    <template #default="{ props }">
      <draggable-module v-for="module in synthesizer.modules" v-bind="props" :module="module" :sx="SLOT_SIZE" :sy="RACK_HEIGHT" @moved="move">
        <module :module="module">
          <control v-for="control in module.controls" v-bind="props" :control="control" :module="module" :synthesizer="synthesizer" />
        </module>
      </draggable-module>
      <cable-list :links="links" :synthesizer="synthesizer" />
      <cable v-if="linking" :start="linkStrategy.origin" :end="linkStrategy.destination" />
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
import type { LinkPayload } from '~/types/Cable';
import type { Draggable } from '~/types/utils/Coordinates';
import type { IStrategy } from '~/utils/draggables/IStrategy';
import type { LinkCreationStrategy } from '~/utils/draggables/LinkCreationStrategy';

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
</script>