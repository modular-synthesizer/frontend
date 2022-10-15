<template>
  <svg
    @mousedown="startDrag(synthesizer, $event.clientX, $event.clientY)"
    @mousemove="moveDrag($event.clientX, $event.clientY)"
    @mouseup="endDrag()"
    @mouseleave="endDrag()"
  >
    <SynthesizerComponent :synthesizer="synthesizer" v-if="synthesizer !== null" />
  </svg>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useLoginStore } from '~~/lib/stores/login';
import { api } from "~~/lib/api/Api";
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import SynthesizerComponent from "~~/components/synthesizers/Synthesizer.vue"
import { useSynthesizerDrag } from '~~/lib/stores/dragSynthesizer';

export default {
  data() {
    return {
      synthesizer: null as Synthesizer || null,
    };
  },
  computed: {
    ...mapState(useLoginStore, ["token"])
  },
  methods: {
    ...mapActions(useSynthesizerDrag, {
      startDrag: 'start',
      moveDrag: 'move',
      endDrag: 'end'
    })
  },
  mounted() {
    api.get("/synthesizers/" + this.$route.params.id, { auth_token: this.token })
      .then(response => {
        this.synthesizer = new Synthesizer(response);
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