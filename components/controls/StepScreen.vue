<template>
  <g :transform="`translate(${x} ${y})`">
    <rect width="60" height="70" stroke="white" stroke-width="3" fill="black"></rect>
    <g transform="translate(5, 5)">
      <Segment :x="0" :y="2" :width="5" :height="25" orientation="right" v-if="is(4, 5, 6, 8)" />
      <Segment :x="0" :y="30" :width="5" :height="25" orientation="right" v-if="is(2, 6, 8)" />

      <Segment :x="24" :y="2" :width="5" :height="25" orientation="left" v-if="is(1, 2, 3, 4, 7, 8)" />
      <Segment :x="24" :y="30" :width="5" :height="25" orientation="left" v-if="is(1, 3, 4, 5, 6, 7, 8)" />

      <Segment :x="2" :y="2" :width="25" :height="5" orientation="bottom" v-if="is(2, 3, 5, 6, 7, 8)" />
      <Segment :x="2" :y="26" :width="25" :height="5" orientation="horizontal" v-if="is(2, 3, 4, 5, 6, 8)" />
      <Segment :x="2" :y="52" :width="25" :height="5" orientation="top" v-if="is(2, 3, 5, 6, 8)" />
    </g>
  </g>
</template>

<script lang="ts">
import { IControl } from '~~/lib/interfaces/IControl';
import Channel from '~~/lib/wrappers/Channel';
import Mod from '~~/lib/wrappers/Mod';
import Segment from './utils/Segment.vue'

export default {
  name: "ControlsStepScreen",
  components: { Segment },
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    target: { type: String, required: true },
    label: { type: String, default: "" },
    mod: { type: Mod, required: true },
    control: { type: Object as PropType<IControl>, required: true }
  },
  methods: {
    is(...steps: number[]) {
      return steps.includes(this.content);
    }
  },
  data() {
    return {
      content: ref(1),
    };
  },
  mounted() {
    this.mod.channels.forEach((channel: Channel) => {
      const node: AudioWorkletNode = channel.getNode(this.target)?.node as AudioWorkletNode;
      node.port.onmessage = ({ data }) => {
        if (data.type === 'content') this.content = data.content + 1;

      };
    });
  }
}
</script>