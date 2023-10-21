<template>
  <rect
    :x="x - 3"
    :y="y - 3"
    width="6"
    :height="height"
    fill="black"
    stroke="#555555"
    stroke-width="2"
  />
  <line
    v-for="i in 21"
    :x1="x + 6"
    :x2="x + 10"
    :y1="y + ((height-6) / 20 * (i-1))"
    :y2="y + ((height-6) / 20 * (i-1))"
    stroke="#BBBBBB"
  />
  <line
    v-for="i in 3"
    :x1="x + 6"
    :x2="x + 13"
    :y1="y + ((height-6) / 2 * (i-1))"
    :y2="y + ((height-6) / 2 * (i-1))"
    stroke="#DDDDDD"
    stroke-width="1.5"
  />
  <g
    @mousedown.left.stop="!control.editing && startParameterSetting($event, parameter)"
    @click.right.stop.prevent="showMenu(parameter, $event)"
  >
    <rect
      :x="x - (knobSize / 2)"
      :width="knobSize"
      :y="yFader"
      :height="knobSize"
      rx="5"
      ry="5"
      fill="black"
      stroke="#555555"
      stroke-width="2"
      class="knob"
    />
    <text :x="x" :y="yFader + (knobSize / 2)" text-anchor="middle" alignment-baseline="middle" fill="white" class="value">
      <slot :value="value">
        {{ value }}
      </slot>
    </text>
  </g>
</template>

<script lang="ts">
import { round } from 'lodash';
import { mapActions } from 'pinia';
import { IControl } from '~~/lib/interfaces/IControl';
import Mod from '~~/lib/wrappers/Mod';
import Parameter from '~~/lib/wrappers/Parameter';

const KNOB_SIZE = 26;

export default {
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    height: { type: Number, default: 180 },
    target: { type: String, required: true },
    label: { type: String, default: "" },
    mod: { type: Mod, required: true },
    control: { type: Object as PropType<IControl>, required: true },
  },
  computed: {
    knobSize(): number {
      return KNOB_SIZE;
    },
    ratio(): number {
      return this.height / 100 * this.parameter.value;
    },
    yFader(): number {
      if (!this.parameter) return 0;
      return this.y + this.height - this.ratio - (KNOB_SIZE / 2)
    },
    xFader(): number {
      return this.x - (KNOB_SIZE / 2);
    },
    parameter(): Parameter {
      return this.mod.param(this.target);
    },
    value(): Number {
        return round(this.parameter.value, this.parameter.precision);
    },
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting']),
    showMenu(parameter: Parameter, $event: MouseEvent) {
      useContexts().display($event, {
        items: [
          {label: 'bind', action: useMidiLearn().learn},
          {label: 'unbind', action: useMidiLearn().unlearn}
        ],
        payload: parameter,
      })
    },
  }
}
</script>

<style scoped>
.knob {
  border-radius: 5px;
}
.value {
    font-size: 10px;
    user-select: none;
    paint-order: stroke;
    stroke: #A9A9A9;
    fill: #B5B5B5;
    stroke-width: 1px;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    stroke-opacity: .5;
    font-weight: 500;
}
</style>