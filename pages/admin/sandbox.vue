<template>
  <v-container>
    <v-row>
      <v-col :offset="3">
        <div class="text-h3">Bac à sable</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col :offset="3" cols="6">
        <v-alert type="info">La variable "context" est accessible pour créer des noeuds dans le code, ainsi que la variable "destination" pour sortir l'audio</v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6" :offset="3">
        <v-textarea variant="outlined" :rows="20" @click="init" no-resize v-model="code" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" offset="3">
        <v-btn color="primary" @click="run">Valider</v-btn>
        <v-btn icon :color="muted ? 'error' : 'success'" size="small" class="ml-2" @click="mute">
          <v-icon v-if="muted">mdi-volume-off</v-icon>
          <v-icon v-else>mdi-volume-high</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  data: () => ({
    initialized: false,
    context: null as unknown as AudioContext,
    destination: null as unknown as GainNode,
    muted: false,
    code: ''
  }),
  methods: {
    init() {
      if (this.initialized) return;
      this.context = new AudioContext();
      this.destination = this.context.createGain();
      this.destination.connect(this.context.destination);
      this.initialized = true;
    },
    async run() {
      this.context.close();
      this.initialized = false;
      this.init();
      const fct = new Function('context', 'destination', this.code);
      fct(this.context, this.destination);
    },
    mute() {
      this.muted = !this.muted;
      this.destination.gain.setValueAtTime(this.muted ? 0 : 1, this.context.currentTime);
    }
  }
}
</script>