<template>
  <g @mousedown.stop="startParameterSetting($event, parameter)">
    <text
      v-if="$te(translationKey)"
      :transform="`translate(${parameter.x}, ${parameter.y - r - 5})`"
      text-anchor="middle"
    >
      {{ $t(translationKey) }}
    </text>
    <g :transform="`translate(${parameter.x} ${parameter.y}) rotate(${angle},0,0)`">
      <polygon :points="`-10,${r-cursorSize} 0,${r+cursorSize} 10,${r-cursorSize}`" fill="black" stroke="black" />
    </g>
    <circle :r="r" :cx="parameter.x" :cy="parameter.y" fill="white" stroke="black" stroke-width="3" />
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
import Parameter from '~~/lib/wrappers/Parameter';
import { round } from "lodash"
import { useI18n } from "vue-i18n"

export default {
  props: {
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
  },
  computed: {
    value() {
        return round(this.parameter.value, this.parameter.precision);
    },
    // The angle of the indicator in the button.
    angle() {
      const delta = this.parameter.maximum / this.parameter.value
      return 20 + (320 / delta)
    },
    translationKey(): string {
      return `modules.${this.parameter.mod.category}.${this.parameter.mod.type}.parameters.${this.parameter.name}`
    }
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting']),
    $te(key: string) {
      return useI18n().te(key)
    },
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