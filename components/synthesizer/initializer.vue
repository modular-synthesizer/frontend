<template>
  <v-dialog :persistent="true" v-model="display" :class="{'welcome-dialog': !mobile}" :fullscreen="mobile">
    <v-card class="mx-auto" max-width="100%">
      <template v-slot:title>{{ $t('init.title') }}</template>
      <v-card-text>
        <div class="mb-2">{{ $t('init.paragraphs.welcome') }}</div>
        <div class="mb-2">{{ $t('init.paragraphs.goal') }}</div>
          <div class="mb-2">{{ $t('init.paragraphs.instructions') }}</div>
          <div class="pl-5">
            <ul>
              <li class="mb-1" v-for="item in $tm('init.list')">{{ item }}</li>
            </ul>
          </div>
        </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :disabled="loading" variant="text" @click="emit('interacted')">
          <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate size="30" />
          </div>
          <span v-else>{{ $t('common.close') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const props = defineProps({
  id: { type: String, required: true },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<{ interacted: []}>();

const display: Ref<boolean> = ref(true);
const mobile: Ref<boolean> = useDisplay().mobile;
</script>

<style>
.welcome-dialog {
  max-width: 50%;
}
</style>