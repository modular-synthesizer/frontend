<template>
  <div :class="['item', 'wrapper', { selected }]"></div>
  <div class="item value" v-if="parameter">{{ value }}</div>
  <div class="label">{{ control.payload.label }}</div>
</template>

<script lang="ts" setup>
import type { SmallKnob, Knob, LargeKnob } from "@jsynple/core"
import { getValue } from '~/core/functions/modules/parameters';

type Props = {
  control: SmallKnob | Knob | LargeKnob
  selected: boolean
}
const props = defineProps<Props>()

const RADIUS = 30;
const DIAMETER = RADIUS * 2

const x = computed(() => +props.control.payload.x - RADIUS)
const y = computed(() => +props.control.payload.y - RADIUS)
const translate = computed(() => `${x.value}px ${y.value}px`)
const diameter = computed(() => `${DIAMETER}px`)
const radius = computed(() => `${RADIUS}px`)

const parameter = props.control.payload.target
const value = computed(() => getValue(parameter))

const labelTranslation = computed(px(x, y.value + DIAMETER + 2))
</script>

<style scoped>
.item {
  width: v-bind(diameter);
  height: v-bind(diameter);
  position: absolute;
  translate: v-bind(translate);
}
.wrapper {
  border-radius: v-bind(radius);
  background-image: conic-gradient(
    #BBB, white 55deg, #999, white, #BBB
  );
  outline: 2px solid black;
}
.selected {
  box-sizing: border-box;
  outline: 3px solid red;
}
.value {
  text-align: center;
  line-height: v-bind(diameter);
  user-select: none;
  color: black;
  font-size: 20px;
  -webkit-text-stroke: 1px white;
  font-weight: 800;
}
.label {
  position: absolute;
  translate: v-bind(labelTranslation);
  width: v-bind(diameter);
  text-align: center;
  font-size: 10px;
  color: black;
  font-weight: 600;
}
</style>