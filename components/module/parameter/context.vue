<template>
  <div :style="{top: `${y}px`, left: `${x}px`}" v-if="display" class="menu-wrapper" v-click-outside="clickConfig">
    <v-list density="compact">
      <!--v-list-item>Edit</v-list-item-->
      <v-list-item @click="learnMidi">{{ $t("midi.bind") }}</v-list-item>
      <v-list-item v-if="Object.keys(handlers).length" @click="unlearnAll()">
        {{ $t("midi.unbindAll") }}
      </v-list-item>
      <v-list-item @click="unlearn(`${knob}`)" v-for="(_, knob) in handlers">
        <v-icon v-if="knob === `${lightened}`">mdi-radiobox-marked</v-icon>
        <v-icon v-else>mdi-radiobox-blank</v-icon>
        {{ $t("midi.unbindSome", { knob }) }}
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import sendParamEvent from '~~/lib/commands/events/sendParamEvent';
import { eventbus } from '~~/lib/utils/eventbus/EventBus';
import Parameter from '~~/lib/wrappers/Parameter';

export default {
  data() {
    return {
      handlers: {} as {[key: string]: Function},
      lightened: -1,
    }
  },
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
    learnMidi() {
      const fct = ({ knob }: any) => {
        eventbus.unsubscribe("midi/generalpurpose", fct);
        this.bindMidiLearn(knob, this.parameter)
      }
      useContextMenus().hide();
      eventbus.subscribe("midi/generalpurpose", fct)
    },
    bindMidiLearn(k: number, parameter: Parameter) {
      this.handlers[k] = this.messageHandler(parameter);
      eventbus.subscribe(`midi/generalpurpose/${k}`, this.handlers[k]);
    },
    unlearn(k: string) {
      eventbus.unsubscribe(`midi/generalpurpose/${k}`, this.handlers[k]);
      delete this.handlers[k];
      useContextMenus().hide();
    },
    unlearnAll() {
      Object.keys(this.handlers).forEach((k: string) => {
        this.unlearn(k);
      })
    },
    messageHandler(parameter: Parameter) {
      return ({ knob, amount }: any) => {
        this.lightened = knob;
        if (this.timeout !== -1) window.clearTimeout(this.timeout);
        const ratio: number = amount / 127;
        const gap: number = parameter.maximum - parameter.minimum;
        
        const value: number = parameter.minimum + (gap * ratio);
        const step: number = parameter.step * 10
        const flooredValue: number = Math.floor(value / step) * step
        parameter.setValue(flooredValue);
        
        this.timeout = window.setTimeout(() => {
          this.lightened = -1
          useParameters().saveParameter(parameter);
          sendParamEvent('endEdit', parameter);
          this.timeout = -1;
        }, 250);
      }
    }
  }
}
</script>