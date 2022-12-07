<template>
  <g :transform="`translate(${x} ${y})`"
    @mousedown.stop="dragstart"
    @click.right.stop.prevent="showMenu(mod, $event)"
  >
    <rect :width="width" :height="height" stroke="black" fill="#A3A3A3" />
    <module-port v-for="port in mod.inputs" :key="port.id" :port="port" />
    <module-port v-for="port in mod.outputs" :key="port.id" :port="port" />
    <component v-for="parameter in mod.parameters" :key="parameter.id" :is="parameter.component" :parameter="parameter" />
  </g>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import { mapActions } from 'pinia';
import Mod from '~~/lib/wrappers/Mod';
import Knob from "../controls/Knob.vue";
import SmallKnob from "../controls/SmallKnob.vue";
import LargeKnob from "../controls/LargeKnob.vue";
import MuteButton from "../controls/MuteButton.vue";

export default {
  name: "module-body",
  components: { Knob, LargeKnob, MuteButton, SmallKnob },
  props: {
    mod: {
      type: Object as PropType<Mod>,
      required: true
    }
  },
  computed: {
    x() { return this.mod.slot * SLOT_SIZE },
    y() { return this.mod.rack * RACK_HEIGHT },
    width() { return this.mod.slots * SLOT_SIZE },
    height() { return RACK_HEIGHT }
  },
  methods: {
    ...mapActions(useModuleMenu, {showMenu: 'show'}),
    dragstart($event: MouseEvent) {
      useModDrag().dragstart(this.mod, $event);
    },
  },
}
</script>
