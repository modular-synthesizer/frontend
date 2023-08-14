<template>
  <synthesizer-events-handler :key="synthesizerKey">
    <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`" v-if="synthesizer">
      <synthesizer-rack v-for="rack in synthesizer.created_racks" :rack="rack" />
      <synthesizer-module v-for="mod in modules" :mod="mod" />
      <synthesizer-module v-if="hovered !== null" :mod="hovered" :hovered="true" />
      <synthesizer-link v-for="link in links" :link="link" />
      <LinkCreator />
      <ExpandersRacks :synthesizer="synthesizer" />
    </g>
  </synthesizer-events-handler>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { v4 as uuid } from 'uuid';
import { useModHover } from '~~/stores/mods/hover';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      key: uuid()
    };
  },
  computed: {
    ...mapState(useModHover, ['hovered']),
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useModulesList, ['modules']),
    ...mapState(useLinksList, ['links']),
    synthesizerKey() {
      return `${this.key}--${this.synthesizer.id}`
    }
  },
  unmounted() {
    useSynthesizerDetails().reset();
    stopManagers();
  },
  async mounted() {
    startManagers();
  }
}
</script>