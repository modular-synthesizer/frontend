<template>
  <g :transform="`translate(${x} ${y})`" @mousedown.stop="startModDrag(mod, $event)">
    <rect :width="width" :height="height" stroke="black" fill="#A3A3A3" />
    <component :is="mod.type" :mod="mod" />
  </g>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import { mapActions } from 'pinia';
import { useModDrag } from '~~/lib/stores/mods/dragAndDrop';
import ProgrammableGain from "./ProgrammableGain.vue"
import SinOscillator from "./SinOscillator.vue"
import StandardOutput from "./StandardOutput.vue"
import SquareLFO from "./SquareLFO.vue"
import Mod from '~~/lib/wrappers/Mod';

export default {
  name: "module-body",
  components: { ProgrammableGain, SinOscillator, SquareLFO, StandardOutput },
  props: {
    mod: {
      type: Object as PropType<Mod>,
      required: true
    }
  },
  computed: {
    x() { return this.mod.slot * SLOT_SIZE },
    y() { return this.mod.rack * RACK_HEIGHT },
    width() { return this.mod.slots * SLOT_SIZE },
    height() { return RACK_HEIGHT }
  },
  methods: {
    ...mapActions(useModDrag, ['startModDrag'])
  },
}
</script>
