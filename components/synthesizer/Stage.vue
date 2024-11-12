<template>
  <draggable-stage :key="synthesizerKey" :position="synthesizer" @move="save(synthesizer)" @zoom="save(synthesizer)" v-if="synthesizer">
    <synthesizer-module v-for="mod in modules" :mod="mod" :hovered="hovered !== null && equals(hovered, mod)" />
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
import { equals } from '~~/lib/interfaces/common/Identifiable';
import Link from '~~/lib/wrappers/Link';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import { useModHover } from '~~/stores/mods/hover';
import { useStates } from '~~/stores/synthesizers/states';

export default {
  props: {
    synthesizer: {
      type: Object as PropType<Synthesizer>,
      required: true
    },
    modules: {
      type: Array<Mod>,
      default: () => []
    },
    links: {
      type: Array<Link>,
      default: () => []
    }
  },
  data: function() {
    return {
      key: uuid()
    };
  },
  computed: {
    ...mapState(useModHover, { hovered: 'current' }),
    synthesizerKey() {
      return `${this.key}--${this.synthesizer.id}`
    }
  },
  methods: {
    ...mapActions(useStates, ['is']),
    save({ id, scale, x, y }: ISynthesizer) {
      console.log(x, y)
      debounce('save', 500, () => api.auth_put(`/synthesizers/${id}`, { x, y, scale }))
    },
    equals
  },
  unmounted() {
    stopManagers();
  },
  async mounted() {
    startManagers();
  }
}
</script>