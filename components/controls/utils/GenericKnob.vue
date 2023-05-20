<template>
  <g v-if="parameter !== undefined" @mousedown.stop="startParameterSetting($event, parameter)" @wheel.passive.stop="wheeled">
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
    <path :d="arcPath(x, y, r - 4, 30, 330)" stroke="#555555" stroke-width="2" fill="transparent"/>
    <path :d="arcPath(x, y, r - 4, 30, angle)" :stroke="lightColor" stroke-width="2" fill="transparent"/>
    <circle :cx="lightCoords.x" :cy="lightCoords.y" :r="2" :fill="lightColor" />
    <text :class="['value', {'small': r < 20}]" :x="x" :y="y" text-anchor="middle" alignment-baseline="middle">
      {{ value }}
    </text>
  </g>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import Parameter from '~~/lib/wrappers/Parameter';
import { round } from "lodash"
import ICoordinates from '~~/lib/interfaces/ICoordinates';
import { useKeyboard } from '~~/stores/common/keyboard';

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
  data: function() {
    return {
      timeout: -1
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
      return polarToCartesian(this.x, this.y, this.r - 4, this.angle)
    },
    lightColor(): string {
      return '#2196F3'
    },
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting']),
    wheeled($e: WheelEvent) {
      if (this.timeout !== -1) window.clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => {
        useParameters().saveParameter(this.parameter);
        this.timeout = -1;
      }, 500);

      const ratio = useKeyboard().shift ? 10 : 1;

      const sign = - $e.deltaY / Math.abs($e.deltaY)
      this.parameter.moveValue(sign * this.parameter.step * ratio);
    }
  },
}
</script>

<style scoped lang="scss">
.value {
    font-size: 12px;
    user-select: none;
    paint-order: stroke;
    stroke: #A9A9A9;
    fill: #B5B5B5;
    stroke-width: 1px;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    stroke-opacity: .5;
    font-weight: 500;

    &.small {
      font-size: 7px;
    }
}
.label-text {
  font-size: 10px;
  user-select: none;
}
</style>