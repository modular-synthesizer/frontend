<template>
  <g v-if="parameter !== undefined" @mousedown.stop="startParameterSetting($event, parameter)" @wheel.passive.stop="wheel">
    <text
      v-if="displayLabel"
      :transform="`translate(${x}, ${y - r - 6})`"
      text-anchor="middle"
      class="label-text"
    >
      {{ label }}
    </text>
    <!--g :transform="`translate(${x} ${y}) rotate(${angle},0,0)`">
      <polygon :points="`-10,${r-cursorSize} 0,${r+cursorSize} 10,${r-cursorSize}`" fill="black" stroke="black" />
    </g>
    <circle :r="r" :cx="x" :cy="y" fill="white" stroke="black" stroke-width="3" /-->
    <circle :cx="x" :cy="y" :r="r" fill="black" />
    <path :d="arcPath(x, y, r - 5, 30, 330)" stroke="#555555" stroke-width="2" fill="transparent"/>
    <path :d="arcPath(x, y, r - 5, 30, angle)" :stroke="lightColor" stroke-width="2" fill="transparent"/>
    <circle :cx="lightCoords.x" :cy="lightCoords.y" :r="2" :fill="lightColor" />
    <text class="value" :x="x" :y="y" text-anchor="middle" alignment-baseline="middle" fill="white" v-if="r >= 20">
      {{ value }}
    </text>
  </g>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import Parameter from '~~/lib/wrappers/Parameter';
import { round } from "lodash"
import ICoordinates from '~~/lib/interfaces/ICoordinates';

export default {
  props: {
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
    value(): Number {
        return round(this.parameter.value, this.parameter.precision);
    },
    angle(): number {
      const delta = this.parameter.maximum / this.parameter.value
      return 30 + (300 / delta)
    },
    displayLabel(): boolean {
      return this.label !== ""
    },
    lightCoords(): ICoordinates {
      return polarToCartesian(this.x, this.y, this.r - 5, this.angle)
    },
    lightColor(): string {
      return '#2196F3'
    }
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting']),
    wheel(event: WheelEvent) {
      if (event.deltaY > 0) {
        this.parameter.moveValue(-this.parameter.step)
      }
      else {
        this.parameter.moveValue(this.parameter.step)
      }
    }
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