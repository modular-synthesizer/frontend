<template>
  <g @mousedown.stop="startParameterSetting($event, param)">
    <circle r="20" :cx="x" :cy="y" fill="white" stroke="black" stroke-width="3" />
    <text
      class="value"
      :x="x"
      :y="y"
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
import { SLOT_SIZE } from '~~/lib/utils/constants';
import Parameter from '~~/lib/wrappers/Parameter';
import { round } from "lodash"

export default {
  name: "Knob",
  props: {
    param: {
      type: Parameter,
      required: true
    },
    dx: {
      type: Number, default: 0
    },
    dy: {
      type: Number, default: 0
    }
  },
  computed: {
    value() {
        return round(this.param.value, this.param.precision);
    },
    x(): number {
      return this.dx * (SLOT_SIZE / 2)
    },
    y(): number {
      return this.dy * (SLOT_SIZE / 2)
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