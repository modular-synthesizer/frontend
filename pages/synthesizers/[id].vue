<template>
  <svg
    @mousedown="startDrag(synthesizer, $event.clientX, $event.clientY)"
    @mousemove="moveDrag($event.clientX, $event.clientY)"
    @mouseup="endDrag()"
    @mouseleave="endDrag()"
    @wheel.prevent="setScale($event.deltaY)"
  >
    <SynthesizerComponent :synthesizer="synthesizer" v-if="synthesizer !== null" />
  </svg>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { api } from "~~/lib/api/Api";
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import SynthesizerComponent from "~~/components/synthesizers/Synthesizer.vue"
import { useSynthesizerDrag } from '~~/lib/stores/dragSynthesizer';
import { useZoomStore } from '~~/lib/stores/zoom';
import { useAuthentication } from '~~/lib/stores/authentication';

export default {
  data() {
    return {
      synthesizer: null as Synthesizer || null,
    };
  },
  computed: {
    ...mapState(useAuthentication, ["session"])
  },
  methods: {
    ...mapActions(useSynthesizerDrag, {
      startDrag: 'start',
      moveDrag: 'move',
      endDrag: 'end'
    }),
    ...mapActions(useZoomStore, ['setScale', 'setSynthesizer'])
  },
  mounted() {
    api.get("/synthesizers/" + this.$route.params.id, { auth_token: this.session.token })
      .then(response => {
        this.synthesizer = new Synthesizer(response);
        this.setSynthesizer(this.synthesizer);
      });
  },
  components: { SynthesizerComponent }
}
</script>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  background-color: silver;
}
</style>