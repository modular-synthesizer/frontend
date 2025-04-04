<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-layout-item v-if="floating" model-value position="bottom" class="text-end pointer-events-none" size="88">
        <div class="ma-4 pointer-events-initial">
          <v-btn v-bind="activatorProps" color="primary" class="text-white" icon="mdi-plus" size="large" elevation="8" />
        </div>
      </v-layout-item>
      <v-btn v-else v-bind="activatorProps" color="primary" class="text-white">Créer</v-btn>
    </template>

    <template v-slot:default=" { isActive }">
      <v-card title="Créer un synthétiseur">
        <v-form @submit.prevent="submit(isActive)" v-model="validForm" class="mt-5" validate-on="blur">
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
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

let synthesizer: Ref<Synthesizer> = ref(createEmptySynthesizer());

const translator = useI18n();

const emit = defineEmits<{ created: [ synth: Synthesizer ] }>();

const props = defineProps({ floating: { type: Boolean, default: false } })

const validForm = ref(true);

const rules: {[key: string]: Function[]} = {
  name: [
    required("synthesizers.errors.name.required", translator),
    minlength(6, "synthesizers.errors.name.minlength", translator),
  ],
  voices: [
    boundaries(1, 32, "synthesizers.errors.voices.boundaries", translator),
  ],
};

function close(isActive: Ref<boolean>) {
  isActive.value = false;
  synthesizer = ref(createEmptySynthesizer());
}

async function submit(isActive: Ref<boolean>) {
  if (!!validForm.value) {
    emit("created", synthesizer.value);
    close(isActive);
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