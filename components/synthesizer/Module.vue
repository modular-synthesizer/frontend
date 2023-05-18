<template>
  <g :transform="`translate(${x} ${y})`"
    @mousedown.stop="dragstart"
    @click.right.stop.prevent="showMenu(mod, $event)"
  >
    <rect :width="width" :height="height" stroke="black" fill="#777777" />
    <template v-if="mod.controls.length > 0" v-for="control in mod.controls">
      <ControlsWrapper :mod="mod" :control="control" />
    </template>
    <module-screws :slots="mod.slots" />
  </g>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import { mapActions } from 'pinia';
import Mod from '~~/lib/wrappers/Mod';
export default {
  name: "module-body",
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
    ...mapActions(useModuleMenu, {showMenu: 'show'}),
    dragstart($event: MouseEvent) {
      useModDrag().dragstart(this.mod, $event);
    },
  },
}
</script>
