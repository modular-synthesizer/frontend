<template>
  <synthesizer-events-handler>
    <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`" v-if="synthesizer">
      <synthesizer-rack v-for="rack in synthesizer.racks" :rack="rack" />
      <synthesizer-module v-for="mod in modules" :mod="mod" />
      <synthesizer-link v-for="link in links" :link="link" />
      <LinkCreator />
      <ExpandersRacks :synthesizer="synthesizer" />
    </g>
  </synthesizer-events-handler>
</template>

<script lang="ts">
import { mapState } from 'pinia';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useModulesList, ['modules']),
    ...mapState(useLinksList, ['links']),
  },
}
</script>