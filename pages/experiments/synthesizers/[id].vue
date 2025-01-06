<template>
  <stage v-if="synthesizer" :target="synthesizer" @zoom="onzoom" @panned="save">
    <template #default="{ props }">
      <draggable-module v-for="module in synthesizer.modules" v-bind="props" :module="module" :sx="SLOT_SIZE" :sy="RACK_HEIGHT">
        <module :module="module">
          <control v-for="control in module.controls" v-bind="props" :control="control" />
        </module>
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

function save() {
  repositories.synthesizers.update(synthesizer.value);
}
</script>