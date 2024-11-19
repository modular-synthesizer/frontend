<template>
  <draggable-stage :key="synthesizerKey" :position="synthesizer" @move="save()" @zoom="save()" v-if="synthesizer">
    <synthesizer-module v-for="mod in modules" :mod="mod" :hovered="hovered !== null && equals(hovered, mod)" />
    <synthesizer-link v-for="link in links" :link="link" />
    <LinkCreator />
    <module-tooltip v-if="hovered" :mod="hovered" />
  </draggable-stage>
</template>

<script lang="ts">
import { v4 as uuid } from 'uuid';
import { equals } from '~~/lib/interfaces/common/Identifiable';
import { repositories } from '~~/lib/repositories';
import Link from '~~/lib/wrappers/Link';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';
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
      key: uuid(),
      repository: repositories.synthesizers,
    };
  },
  computed: {
    hovered() {
      return useHover().state.value.current;
    },
    synthesizerKey() {
      return `${this.key}--${this.synthesizer.id}`
    }
  },
  methods: {
    save() {
      debounce('save', 500, () => this.repository.update(this.synthesizer))
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