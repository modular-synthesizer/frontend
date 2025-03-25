<template>
  <rect
    :x="- 3"
    :y="- 3"
    width="6"
    :height="height"
    fill="black"
    stroke="#555555"
    stroke-width="2"
  />
  <line
    v-for="i in 21"
    :x1="6"
    :x2="10"
    :y1="(height-6) / 20 * (i-1)"
    :y2="(height-6) / 20 * (i-1)"
    stroke="#BBBBBB"
  />
  <line
    v-for="i in 3"
    :x1="6"
    :x2="13"
    :y1="(height-6) / 2 * (i-1)"
    :y2="(height-6) / 2 * (i-1)"
    stroke="#DDDDDD"
    stroke-width="1.5"
  />
  <g
    @mousedown.left.stop="onmousedown"
    @click.right.stop.prevent="showMenu(parameter, $event)"
  >
    <rect
      :x="- (knobSize / 2)"
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
    <text :y="yFader + (knobSize / 2)" text-anchor="middle" alignment-baseline="middle" fill="white" class="value">
      <slot :value="value">
        {{ value }}
      </slot>
    </text>
  </g>
</template>

<script lang="ts">
import { round } from 'lodash';
import { repositories } from '~/lib/repositories';
import type { DragCallback } from '~/types/draggables/DragDeclaration';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Parameter } from '~/types/modules/Parameter';
import type { Control } from '~/types/tools/Control';
import { setValue } from '~/utils/functions/parameters';
import { DEFAULT_FADER_HEIGHT } from '~~/lib/utils/constants';

const KNOB_SIZE = 26;

export default {
  props: {
    module: { type: Object as PropType<AudioModule>, required: true },
    control: { type: Object as PropType<Control>, required: true },
    dragged: { type: Function as DragCallback, required: true },
    dropped: { type: Function as DragCallback, required: true },
  },
  computed: {
    x(): number {
      return +this.control.payload.x
    },
    y(): number {
      return +this.control.payload.y
    },
    width(): number {
      return 20
    },
    height(): number {
      return DEFAULT_FADER_HEIGHT;
    },
    knobSize(): number {
      return KNOB_SIZE;
    },
    ratio(): number {
      return this.height / 100 * this.parameter.value;
    },
    yFader(): number {
      if (!this.parameter) return 0;
      return this.height - this.ratio - (KNOB_SIZE / 2)
    },
    xFader(): number {
      return - (KNOB_SIZE / 2);
    },
    parameter(): Parameter {
      console.log(this.module, this.target);
      return this.module.parameters[this.target]
    },
    value(): Number {
      return round(this.parameter.value, this.parameter.precision);
    },
    target(): string {
      return '' + this.control.payload.target;
    }
  },
  data: () => ({
    original: 0,
    originalY: 0,
  }),
  methods: {
    showMenu(parameter: Parameter, $event: MouseEvent) {
      useContexts().display($event, {
        items: [
          {label: 'bind', action: useMidiLearn().learn},
          {label: 'unbind', action: useMidiLearn().unlearn}
        ],
        payload: parameter,
      })
    },
    onmousedown($event: MouseEvent) {
      this.original = this.parameter.value;
      this.originalY = $event.clientY;

      this.dragged(($event: MouseEvent) => {
        const delta = Math.round((this.originalY - $event.clientY) / 10);
        const newValue = this.original + delta * this.parameter.step;
        setValue(this.parameter, newValue);
      });
      this.dropped(() => this.save(this.parameter));
    },
    save(parameter: Parameter) {
      parameter.t = Date.now()
      repositories.parameters.update(parameter, useSession().token);
    }
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