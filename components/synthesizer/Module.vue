<template>
  <defs>
    <path :id="mod.id" :d="`M 0 0 H ${width} V ${RACK_HEIGHT} H 0 V 0`" />
    <clipPath :id="`clip-${mod.id}`">
      <use :xlink:href="`#${mod.id}`" />
    </clipPath>
  </defs>
  <sp-stage-draggable stage="synthesizer" :name="mod.id" :target="coordinates" :sx="SLOT_SIZE" :sy="RACK_HEIGHT" @dragend="ondragend" :collision="collides">
    <g
      @click.right.stop.prevent="showMenu(mod, $event)"
      @mouseenter.stop="useHover().mouseenter(mod)"
      @mouseleave.stop="useHover().mouseleave()"
    >
      <rect
        :width="width"
        :height="RACK_HEIGHT"
        class="stroke-shades-black fill-grey"
        :class="{ hovered }"
        :clip-path="`url(#clip-${mod.id})`"
      />
      <template v-if="mod.controls.length > 0" v-for="control in mod.controls">
        <ControlsWrapper :mod="mod" :control="control" />
      </template>
      <module-screws :slots="mod.slots" />
    </g>
  </sp-stage-draggable>
</template>

<script lang="ts" setup>
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Coordinates } from '~/types/utils/Coordinates';
import { repositories } from '~/lib/repositories';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { hasRoom } from '~/utils/functions/synthesizers';
import { place } from '~/utils/functions/modules';

const { mod, hovered, synthesizer } = defineProps({
  mod: { type: Object as PropType<AudioModule>, required: true },
  hovered: { type: Boolean, default: false },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true }
});

const coordinates: Ref<Coordinates> = ref({
  x: mod.slot * SLOT_SIZE,
  y: mod.rack * RACK_HEIGHT,
});

const width: number = mod.slots * SLOT_SIZE;

function showMenu(mod: AudioModule, $event: MouseEvent) {
  useContexts().display($event, {
    items: [
      {label: "unlink", action: useSynthesizer().disconnectModule},
      {label: "remove", action: useSynthesizer().removeModule}
    ],
    payload: mod
  });
}

function ondragend(c: Coordinates) {
  const { slot, rack } = fromCoords(c);
  if (!hasRoom(synthesizer, { id: mod.id, slot, rack, slots: mod.slots })) return;
  place(mod, rack, slot);
  coordinates.value = c;
  repositories.modules.update(mod);
}

function fromCoords(c: Coordinates): { slot: number, rack: number} {
  return {
    slot: Math.round(c.x / SLOT_SIZE),
    rack: Math.round(c.y / RACK_HEIGHT)
  }
}

function collides(c: Coordinates): Boolean {
  const { slot, rack } = fromCoords(c);
  return !hasRoom(synthesizer, { id: mod.id, slot, rack: rack, slots: mod.slots });
}
</script>

<style scoped>
.hovered {
  z-index: 100;
  stroke: white;
  stroke-width: 4;
}
</style>