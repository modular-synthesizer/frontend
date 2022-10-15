<template>
  <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`">
    <Rack v-for="rack in synthesizer.racks" :rack="rack" />
  </g>
</template>

<script lang="ts">
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import Rack from '~~/components/synthesizers/Rack.vue';

export default {
  components: { Rack },
  props: {
    synthesizer: {
      type: Synthesizer,
      required: true
    }
  }
}
</script>