<template>
  <draggable-stage :position="synthesizer" @move="save()" @zoom="save()" v-if="synthesizer">
    <synthesizer-module v-for="mod in modules" :mod="mod" :hovered="hovered !== null && equals(hovered, mod)" />
    <synthesizer-link v-for="link in links" :link="link" />
    <LinkCreator />
    <module-tooltip v-if="hovered" :mod="hovered" />
  </draggable-stage>
</template>

<script lang="ts">
import { equals } from '~~/lib/interfaces/common/Identifiable';
import { repositories } from '~~/lib/repositories';
import Link from '~~/lib/wrappers/Link';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

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
      repository: repositories.synthesizers,
    };
  },
  computed: {
    hovered() {
      return useHover().state.value.current;
    },
  },
  methods: {
    save() {
      debounce('save', 500, () => {
        this.repository.update(this.synthesizer);
      })
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