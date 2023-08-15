<template>
  <g :transform="`translate(${x} ${y})`"
    @mousedown.left.stop="dragstart"
    @click.right.stop.prevent="showMenu(mod, $event)"
    @mouseenter="mouseenter(mod)"
    @mouseleave="mouseleave"
  >
    <g v-if="hovered" transform="translate(10 -40)">
      <foreignObject x="1" y="1" class="label-container">
          <span class="label-wrapper">{{ $t(`modules.${mod.category}.${mod.type}.title`) }}</span>
      </foreignObject>
      <line x1="10" y1="40" x2="10" y2="25" stroke="white" stroke-width="3" />
    </g>
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
    ...mapActions(useModuleMenu, {showMenu: 'show'}),
    ...mapActions(useModHover, ['mouseenter', 'mouseleave']),
    dragstart($event: MouseEvent) {
      useModDrag().dragstart(this.mod, $event);
    },
  },
}
</script>

<style scoped>
.hovered {
  z-index: 100;
  stroke: white;
  stroke-width: 3;
}

.label-container {
  overflow: visible;
}

.label-wrapper {
  font-size: 12px;
  white-space: nowrap;
  border: 3px solid white;
  padding: 3px 6px;
  box-sizing: border-box;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>