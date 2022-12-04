<template>
  <synthesizer-events-handler>
    <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`">
      <Rack v-for="rack in synthesizer.racks" :rack="rack" />
      <ModulesBody v-for="mod in modules" :mod="mod" />
      <Connection v-for="link in links" :link="link" />
      <!--LinkCreator v-if="startPort" /-->
    </g>
  </synthesizer-events-handler>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import Rack from '~~/components/synthesizers/Rack.vue';

export default {
  components: { Rack },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useModulesList, ['modules']),
    ...mapState(useConnectionsList, ['links']),
  },
  async mounted() {
    await useSynthesizerDetail().fetch(this.id);
    await useModulesList().fetch(this.id);
    await useConnectionsList().fetch(this.id);
  },
}
</script>