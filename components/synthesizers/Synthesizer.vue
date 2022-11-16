<template>
  <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`">
    <Rack v-for="rack in synthesizer.racks" :rack="rack" />
    <ModulesBody v-for="mod in mods" :mod="mod" />
    <Connection v-for="link in links" :link="link" />
    <LinkCreator v-if="startPort" />
  </g>
</template>

<script lang="ts">
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import Rack from '~~/components/synthesizers/Rack.vue';
import Mod from '~~/lib/wrappers/Mod';
import Link from '~~/lib/wrappers/Link';
import { mapState } from 'pinia';
import { useLinkDrag } from '~~/lib/stores/links/dragAndDrop';

export default {
  components: { Rack },
  props: {
    synthesizer: {
      type: Synthesizer,
      required: true
    },
    mods: {
      type: Array<Mod>,
      required: true
    },
    links: {
      type: Array<Link>,
      required: true
    }
  },
  computed: {
    ...mapState(useLinkDrag, ['startPort'])
  }
}
</script>