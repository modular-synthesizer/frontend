<template>
  <g
    v-if="parameter !== undefined"
    @mousedown.stop="startParameterSetting($event, parameter)"
    @click.right.prevent.stop="openDialog(ex, y)"
  >
    <text
      v-if="displayLabel"
      :transform="`translate(${x}, ${y - r - 6})`"
      text-anchor="middle"
      class="label-text"
    >
      {{ label }}
    </text>
    <g :transform="`translate(${x} ${y}) rotate(${angle},0,0)`">
      <polygon :points="`-10,${r-cursorSize} 0,${r+cursorSize} 10,${r-cursorSize}`" fill="black" stroke="black" />
    </g>
    <circle :r="r" :cx="x" :cy="y" fill="white" stroke="black" stroke-width="3" />
    <text class="value" :x="x" :y="y" text-anchor="middle" alignment-baseline="middle">
      {{ displayDialog }}
    </text>
  </g>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import Parameter from '~~/lib/wrappers/Parameter';
import { round } from "lodash"
import { useKnobEdition } from "@/stores/knobs/edition"
import Mod from '~~/lib/wrappers/Mod';
import { SLOT_SIZE } from '~~/lib/utils/constants';

export default {
  props: {
    mod: { type: Mod, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    parameter: {
      type: Parameter,
      required: true
    },
    r: {
      type: Number,
      default: 20
    },
    cursorSize: {
      type: Number,
      default: 8
    },
    label: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(useKnobEdition, ["displayDialog"]),
    value(): Number {
        return round(this.parameter.value, this.parameter.precision);
    },
    angle(): Number {
      const delta = this.parameter.maximum / this.parameter.value
      return 20 + (320 / delta)
    },
    displayLabel(): boolean {
      return this.label !== ""
    },
    ex() {
      return (this.mod.slot * SLOT_SIZE) + this.x
    }
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting']),
    ...mapActions(useKnobEdition, ["openDialog"])
  },
}
</script>

<style scoped>
.value {
    font-size: 10px;
    user-select: none;
    paint-order: stroke;
    stroke: white;
    stroke-width: 1px;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    stroke-opacity: .5;
    font-weight: 500;
}
.label-text {
  font-size: 10px;
  user-select: none;
}
</style>