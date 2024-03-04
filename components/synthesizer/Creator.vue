<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-layout-item model-value position="bottom" class="text-end pointer-events-none" size="88">
        <div class="ma-4 pointer-events-initial">
          <v-btn v-bind="activatorProps" color="primary" class="text-white" icon="mdi-plus" size="large" elevation="8" />
        </div>
      </v-layout-item>
    </template>

    <template v-slot:default=" { isActive }">
      <v-card title="Créer un synthétiseur">
        <v-form @submit.prevent="submit(isActive)" v-model="validForm" class="mt-5" validate-on="submit" ref="form">
          <v-card-text>
            <v-text-field
              v-model="synthesizer.name"
              variant="outlined"
              :rules="rules.name"
              :label="$t('synthesizers.create.labels.name')"
              required
              class="mb-3"
            />
            <v-text-field
              v-model="synthesizer.racks"
              type="number"
              variant="outlined"
              density="comfortable"
              :label="$t('synthesizers.create.labels.racks')"
              :min=1
              :max=4
              class="mb-3"
            />
            <v-text-field
              v-model="synthesizer.slots"
              type="number"
              variant="outlined"
              density="comfortable"
              :label="$t('synthesizers.create.labels.slots')"
              :min=10
              :max=50
              class="mb-3"
            />
            <v-text-field
              v-model="synthesizer.voices"
              type="number"
              variant="outlined"
              density="comfortable"
              :label="$t('synthesizers.create.labels.voices')"
              :min=1
              :max=32
              class="mb-3"
              :rules="rules.voices"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn type="submit" color="primary">{{ $t('common.create') }}</v-btn>
            <v-spacer />
            <v-btn @click="close(isActive)">{{ $t('common.close') }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { boundaries, minlength, required } from '@/lib/rules';
import { useI18n } from 'vue-i18n';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

let synthesizer = ref(createEmptySynthesizer());

const translator = useI18n();

const synthesizers = ref(await useLists().synthesizers);

const form = ref(null);
const validForm = ref(true);

const rules: {[key: string]: Function[]} = {
  name: [
    required("synthesizers.errors.name.required", translator),
    minlength(6, "synthesizers.errors.name.minlength", translator),
  ],
  racks: [
    boundaries(1, 4, "synthesizers.errors.racks.boundaries", translator),
  ],
  slots: [
    boundaries(10, 50, "synthesizers.errors.slots.boundaries", translator),
  ],
  voices: [
    boundaries(1, 32, "synthesizers.errors.voices.boundaries", translator),
  ],
};

function close(isActive: Ref<boolean>) {
  synthesizer = ref(createEmptySynthesizer());
  isActive.value = false;
}

async function submit(isActive: Ref<boolean>) {
  await form.value.validate();
  if (form.value.modelValue !== false) {
    const creation: Synthesizer = new Synthesizer(synthesizer.value);
    synthesizers.value.create(creation);
    close(isActive)
  }
}
</script>

<style scoped>
  .pointer-events-none {
    pointer-events: none;
  }
  
  .pointer-events-initial {
    pointer-events: initial;
  }
</style>