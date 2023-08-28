<template>
  <div :style="{top: `${y}px`, left: `${x}px`}" v-if="display" class="menu-wrapper" v-click-outside="clickConfig">
    <v-list density="compact">
      <!--v-list-item>Edit</v-list-item-->
      <v-list-item @click="learnMidi">Bind MIDI knob</v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import sendParamEvent from '~~/lib/commands/events/sendParamEvent';
import { eventbus } from '~~/lib/utils/eventbus/EventBus';
import Parameter from '~~/lib/wrappers/Parameter';

export default {
  computed: {
    ...mapState(useParameterMenu, {p: 'parameter'}),
    parameter(): Parameter {
      return this.p as Parameter;
    },
    ...mapState(useContextMenus, ['x', 'y', 'displayed']),
    clickConfig() {
      return {
        handler: () => useContextMenus().hide(),
        events: ['mousedown']
      }
    },
    display() {
      return this.displayed === "parameters"
    },
  },
  methods: {
    learnMidi($event: MouseEvent) {
      const fct = ({ knob }: any) => {
        eventbus.unsubscribe("midi/generalpurpose", fct);
        this.bindMidiLearn(knob, this.parameter)
      }
      useContextMenus().hide();
      eventbus.subscribe("midi/generalpurpose", fct)
    },
    bindMidiLearn(k: number, parameter: Parameter) {
      eventbus.subscribe("midi/generalpurpose", ({ knob, amount }: any) => {
        if (knob !== k) return;
        
        if (this.timeout !== -1) window.clearTimeout(this.timeout);
        const ratio: number = amount / 127;
        const gap: number = parameter.maximum - parameter.minimum;
        
        const value: number = parameter.minimum + (gap * ratio);
        const step: number = parameter.step * 10
        const flooredValue: number = Math.floor(value / step) * step
        parameter.setValue(flooredValue);
        
        this.timeout = window.setTimeout(() => {
          useParameters().saveParameter(parameter);
          sendParamEvent('endEdit', parameter);
          this.timeout = -1;
        }, 500);
      });
    }
  }
}
</script>