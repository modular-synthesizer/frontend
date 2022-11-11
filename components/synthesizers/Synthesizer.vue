<template>
  <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`">
    <Rack v-for="rack in synthesizer.racks" :rack="rack" />
    <ModulesBody v-for="mod in mods" :mod="mod" />
  </g>
</template>

<script lang="ts">
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import Rack from '~~/components/synthesizers/Rack.vue';
import IModule from '~~/lib/interfaces/IModule';

export default {
  components: { Rack },
  props: {
    synthesizer: {
      type: Synthesizer,
      required: true
    },
    mods: {
      type: Array<IModule>,
      required: true
    }
  },
}
</script>