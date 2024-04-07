<template>
  <v-container>
    <v-row>
      <v-col :offset="offset">
        <div class="text-h3">Bac à sable</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col :offset="offset" :cols="cols">
        <v-alert type="info">
          Certaines variables sont disponibles :
          <ul>
            <li>La variable "context" permet d'accéder à l'AudioContext</li>
            <li>La variable "destination" pour accéder à la sortie audio</li>
            <li>La variable "trigger" pour déclencher un impulse via <v-btn variant="text" @click="triggerImpulse()">ce lien</v-btn></li>
          </ul>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="cols" :offset="offset">
        <HighCode
          class="code"
          :codeValue="code"
          width="100%"
          height="500px"
          lang="javascript"
          theme="light"
          :textEditor="true"
          @getCodeValue="save"
          ref="highlighter"
        ></HighCode>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="cols" :offset="offset">
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
import { HighCode } from 'vue-highlight-code';
import 'vue-highlight-code/dist/style.css';
import { loadProcessors } from '~~/composables/processors'

export default {
  components: { HighCode },
  data: () => ({
    initialized: false,
    context: null as unknown as AudioContext,
    destination: null as unknown as GainNode,
    trigger: null as unknown as AudioWorkletNode,
    muted: false,
    previousVolume: 1,
    code: localStorage.getItem("sandbox-code") ?? "",
    offset: 2,
    cols: 8,
  }),
  methods: {
    async init() {
      this.context = new AudioContext();
      await loadProcessors(this.context);
      this.destination = this.context.createGain();
      this.destination.connect(this.context.destination);

      this.trigger = new AudioWorkletNode(this.context, "pulse", {numberOfOutputs: 1});

    },
    async run() {
      if (this.context !== null) {
        this.context.close();
      }
      await this.init();
      const fct = new Function('context', 'destination', "trigger", this.code);
      fct(this.context, this.destination, this.trigger);
      if (this.muted) this.context.suspend();
    },
    mute() {
      this.muted = !this.muted;
      this.muted ? this.context.suspend() : this.context.resume();
    },
    save(_event: PointerEvent) {
      const highlighter = this.$refs.highlighter as any;
      this.code = highlighter.modelValue;
      localStorage.setItem("sandbox-code", highlighter.modelValue);
    },
    triggerImpulse() {
      this.trigger.port.postMessage('pulse');
    }
  }
}
</script>

<script setup lang="ts">
const highlighter = ref(null);
</script>