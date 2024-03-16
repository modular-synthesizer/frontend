<template>
  <g
    v-if="parameter !== undefined"
    @mousedown.left.stop="mouseDown"
    @wheel.passive="wheelEvent"
    @click.right.stop.prevent="showMenu(parameter, $event)"
    v-touch:tap="() => console.log('tap')"
    v-touch:hold.prevent.stop="startModalEdition"
  >
    <text
      :transform="`translate(${x}, ${y - r - 6})`"
      text-anchor="middle"
      class="label-text fill-shades-black stroke-grey-darken-1"
    >
      {{ label  }}
    </text>
    <circle :cx="x" :cy="y" :r="r" fill="black" />
    <arc-circle :x="x" :y="y":r="r - 4" :ir="2" :min="parameter.minimum" :max="parameter.maximum" :value="value" />
    <text :class="['value', {'small': r < 20}, 'fill-grey-lighten-2', 'stroke-grey-lighten-1']" :x="x" :y="y" text-anchor="middle" alignment-baseline="middle">
      <slot :value="value">
        {{ value }}
      </slot>
    </text>
  </g>
  <circle :cx="x" :cy="y" :r="r + 1" v-if="control.editing" class="stroke-grey-lighten-2" stroke-width="2" />
  <circle :cx="x" :cy="y" :r="r + 3" v-if="control.editing" class="stroke-grey-lighten-1" stroke-width="2" />
</template>

<script lang="ts">
import Parameter from '~~/lib/wrappers/Parameter';
import { round } from "lodash"
import { useKeyboard } from '~~/stores/common/keyboard';
import { IControl } from '~~/lib/interfaces/IControl';
import sendParamEvent from '~~/lib/commands/events/sendParamEvent';
import { useMidiLearn } from '~~/stores/parameters/midi_learn';
import { useDisplay } from 'vuetify/lib/framework.mjs';

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
    },
    control: {
      type: Object as PropType<IControl>,
      required: true,
    }
  },
  data: function() {
    return {
      timeout: -1,
      mobile: false,
    }
  },
  computed: {
    fill(): string {
      return this.control.editing ? 'red' : 'black';
    },
    value(): Number {
        return round(this.parameter.value, this.parameter.precision);
    },
    displayLabel(): boolean {
      return this.label !== ""
    },
  },
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
    wheeled($e: WheelEvent) {
      if (this.timeout !== -1) window.clearTimeout(this.timeout);

      sendParamEvent('startEdit', this.parameter);

      this.timeout = window.setTimeout(() => {
        saveParameter(this.parameter);
        sendParamEvent('endEdit', this.parameter);
        this.timeout = -1;
      }, 500);

      const ratio = useKeyboard().shift ? 10 : 1;

      const sign = - $e.deltaY / Math.abs($e.deltaY)
      this.parameter.moveValue(sign * this.parameter.step * ratio);
    },
    wheelEvent($event: WheelEvent): void {
      if (this.control.editing || this.zooming) return;
      $event.stopPropagation();
      this.wheeled($event)
    },
    mouseDown($event: MouseEvent) {
      if (this.control.editing) return;
      this.control.editing = true;
      startParameterSetting({
        control: this.control,
        $event,
        parameter: this.parameter,
        mode: Strategies.DECORRELATED
      },
      () => (this.control.editing = false));
    },
    startModalEdition($event: TouchEvent) {
      console.log(this.mobile);
      if (!this.mobile) return;
      useEditionModal().showParameter(this.parameter);
    }
  },
  mounted() {
    this.mobile = useDisplay().mobile.value;
    console.log(this.mobile);
  }
}
</script>

<style scoped lang="scss">
.value {
    font-size: 12px;
    user-select: none;
    paint-order: stroke;
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
  paint-order: stroke;
}
</style>