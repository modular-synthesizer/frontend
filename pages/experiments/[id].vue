<template>
  <stage v-if="synthesizer" :target="synthesizer" @zoom="onzoom">
    <template #default="{ props }">
      <draggable-module v-for="module in synthesizer.modules" v-bind="props" :module="module" :sx="SLOT_SIZE" :sy="RACK_HEIGHT">
        <g :transform="translate({ x: module.slot * SLOT_SIZE, y: module.rack * RACK_HEIGHT })">
          <rect :width="module.slots * SLOT_SIZE" :height="RACK_HEIGHT" fill="black" stroke="white" />
        </g>
      </draggable-module>
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
import { translate } from '~/utils/functions/svg';

definePageMeta({ layout: false })

const id: string = useRoute().params.id as string;
const synthesizer: Ref<Synthesizer> = ref(await repositories.synthesizers.get(id));
const modules: Ref<Array<ModulePayload>> = ref(await repositories.modules.list(synthesizer.value));
const generators: Ref<Array<Generator>> = ref(await repositories.generators.list());

synthesizer.value.modules = await Promise.all(
  modules.value.map(async (payload: ModulePayload): Promise<AudioModule> => {
    return await createModule(payload, generators.value, synthesizer.value)
  })
);

function onzoom(scale: number) {
  synthesizer.value.scale = scale;
}
</script>