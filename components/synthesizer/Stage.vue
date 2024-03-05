<template>
  <draggable-stage :key="synthesizerKey" :position="synthesizer" @move="save(synthesizer)" @zoom="save(synthesizer)" v-if="synthesizer">
    <synthesizer-module v-for="mod in modules" :mod="mod" :hovered="hovered !== null && hovered.id === mod.id" />
    <synthesizer-link v-for="link in links" :link="link" />
    <LinkCreator />
    <module-tooltip v-if="hovered" :mod="hovered" />
  </draggable-stage>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia';
import { v4 as uuid } from 'uuid';
import { api } from '~~/lib/api/Api';
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';
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
    save({ id, scale, x, y }: ISynthesizer) {
      debounce('save', 500, () => api.auth_put(`/synthesizers/${id}`, { x, y, scale }))
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