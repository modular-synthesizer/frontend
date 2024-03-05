<template>
  <v-dialog :persistent="true" v-model="display" class="welcome-dialog">
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
        <v-btn color="primary" :disabled="loading" variant="text" @click="click">
          <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate size="30" />
          </div>
          <span v-else>{{ $t('common.close') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  props: {
    id: {
      type: String,
      required: true,
    }
  },
  data: () => ({
    display: true,
    loading: false,
  }),
  methods: {
    async click() {
      this.loading = true;
      await useAudioContext().initContext();
      await loadProcessors(useAudioContext().context as AudioContext);
      await useSynthesizerDetails().fetch(this.id);
      await useModulesList().fetch(this.id);
      useSynthesizerDetails().synthesizer.setModules(useModulesList().modules);
      await useLinksList().fetch(this.id);
      this.loading = false;
      this.display = false;
    }
  }
}
</script>

<style>
.welcome-dialog {
  max-width: 50%;
}
</style>