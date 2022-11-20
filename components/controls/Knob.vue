<template>
  <g @mousedown.stop="startParameterSetting($event, parameter)">
    <circle r="20" :cx="parameter.x" :cy="parameter.y" fill="white" stroke="black" stroke-width="3" />
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
  name: "Knob",
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
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting'])
  },
}
</script>

<style scoped>
.value {
    font-size: 12px;
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