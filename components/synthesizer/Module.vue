<template>
  <defs>
    <path :id="mod.id" :d="`M 0 0 H ${width} V ${height} H 0 V 0`" />
    <clipPath :id="`clip-${mod.id}`">
      <use :xlink:href="`#${mod.id}`" />
    </clipPath>
  </defs>
  <g :transform="`translate(${x} ${y})`"
    @mousedown.left.stop="dragstart"
    @click.right.stop.prevent="showMenu(mod, $event)"
    @mouseenter="useHover().mouseenter(mod)"
    @mouseleave="useHover().mouseleave()"
  >
    <rect
      :width="width"
      :height="height"
      class="stroke-shades-black fill-grey"
      :class="{ hovered }"
      :clip-path="`url(#clip-${mod.id})`"
    />
    <template v-if="mod.controls.length > 0" v-for="control in mod.controls">
      <ControlsWrapper :mod="mod" :control="control" />
    </template>
    <module-screws :slots="mod.slots" />
  </g>
</template>

<script lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

export default {
  name: "module-body",
  props: {
    mod: {
      type: Object as PropType<AudioModule>,
      required: true
    },
    hovered: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    x() { return this.mod.slot * SLOT_SIZE },
    y() { return this.mod.rack * RACK_HEIGHT },
    width() { return this.mod.slots * SLOT_SIZE },
    height() { return RACK_HEIGHT }
  },
  methods: {
    dragstart($event: MouseEvent) {
      const synthesizer: Synthesizer|null = useSynthesizer().synthesizer.value;
      if (synthesizer === null) return;
      useModuleDrag().start($event, this.mod, synthesizer);
    },
    showMenu(mod: AudioModule, $event: MouseEvent) {
      useContexts().display($event, {
        items: [
          {label: "unlink", action: useSynthesizer().disconnectModule},
          {label: "remove", action: useSynthesizer().removeModule}
        ],
        payload: mod
      });
    }
  },
}
</script>

<style scoped>
.hovered {
  z-index: 100;
  stroke: white;
  stroke-width: 4;
}
</style>