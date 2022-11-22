<template>
  <g @mousedown.stop="startParameterSetting($event, parameter)">
    <circle r="16" :cx="parameter.x" :cy="parameter.y" fill="white" stroke="black" stroke-width="3" />
    <g :transform="`translate(${parameter.x} ${parameter.y}) rotate(${angle},0,0)`">
      <rect x="-1.5" width="3" y="9" height="7" fill="black" class="indicator"></rect>
    </g>
    <text
      class="value"
      :x="parameter.x"
      :y="parameter.y"
      text-anchor="middle"
      alignment-baseline="middle"
    >
      {{ value }}
    </text>
  </g>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import { useParameters } from '~~/lib/stores/tools/parameters';
import Parameter from '~~/lib/wrappers/Parameter';
import { round } from "lodash"

export default {
  props: {
    parameter: {
      type: Parameter,
      required: true
    },
  },
  computed: {
    value() {
        return round(this.parameter.value, this.parameter.precision);
    },
    // The angle of the indicator in the button.
    angle() {
      const delta = this.parameter.maximum / this.parameter.value
      return 20 + (320 / delta)
    }
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting'])
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
</style>