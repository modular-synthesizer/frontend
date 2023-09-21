<template>
  <g :transform="`translate(${x} ${y})`"
    @mousedown.left.stop="dragstart"
    @click.right.stop.prevent="showMenu(mod, $event)"
    @mouseenter="mouseenter(mod)"
    @mouseleave="mouseleave()"
  >
    <rect
      :width="width"
      :height="height"
      stroke="black"
      fill="#777777"
      :class="{ hovered }"
    />
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
import { useModHover } from '~~/stores/mods/hover';
import { useModulesLinks } from '~~/stores/mods/links';

export default {
  name: "module-body",
  props: {
    mod: {
      type: Object as PropType<Mod>,
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
    ...mapActions(useModHover, ['mouseenter', 'mouseleave']),
    dragstart($event: MouseEvent) {
      useModDrag().dragstart(this.mod, $event);
    },
    showMenu(mod: Mod, $event: MouseEvent) {
      useContexts().display($event, {
        items: [
          {label: "disconnect", action: useModulesLinks().disconnect},
          {label: "delete", action: useModulesList().remove}
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
  stroke-width: 3;
}
</style>