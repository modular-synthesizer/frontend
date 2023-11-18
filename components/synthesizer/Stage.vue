<template>
  <synthesizer-events-handler :key="synthesizerKey">
    <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`" v-if="synthesizer">
      <synthesizer-rack v-for="rack in synthesizer.created_racks" :rack="rack" />
      <synthesizer-module v-for="mod in modules" :mod="mod" :hovered="hovered !== null && hovered.id === mod.id" />
      <synthesizer-link v-for="link in links" :link="link" />
      <LinkCreator />
      <ExpandersRacks :synthesizer="synthesizer" />
      <module-tooltip v-if="hovered" :mod="hovered" />
    </g>
  </synthesizer-events-handler>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia';
import { v4 as uuid } from 'uuid';
import { useModHover } from '~~/stores/mods/hover';
import { useStates } from '~~/stores/synthesizers/states';

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
    ...mapState(useModHover, { hovered: 'current' }),
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useModulesList, ['modules']),
    ...mapState(useLinksList, ['links']),
    synthesizerKey() {
      return `${this.key}--${this.synthesizer.id}`
    }
  },
  methods: {
    ...mapActions(useStates, ['is']),
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