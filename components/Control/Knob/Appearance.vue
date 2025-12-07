<template>
  <div :class="['item', 'wrapper', { selected }]"></div>
  <div class="item value">{{ value }}</div>
  <div class="label">{{ control.payload.label }}</div>
</template>

<script lang="ts" setup>
import type { SmallKnob, Knob, LargeKnob } from "@jsynple/core"
import { getValue } from '~/core/functions/modules/parameters';
import { px } from "~/core/functions/css";

type Props = {
  control: SmallKnob | Knob | LargeKnob
  selected: boolean
}
const { control, selected } = defineProps<Props>()

const RADIUS = 20;
const DIAMETER = RADIUS * 2

const x = computed(() => control.payload.x - RADIUS)
const y = computed(() => control.payload.y - RADIUS)

const translate = computed(px(x, y))
const diameter = computed(px(DIAMETER))
const radius = computed(px(RADIUS))

const value = computed(() => getValue(control.payload.target))

const labelTranslation = computed(px(x, y.value + DIAMETER))
</script>

<style scoped>
.item {
  width: v-bind(diameter);
  height: v-bind(diameter);
  position: absolute;
  translate: v-bind(translate);
}
.wrapper {
  background-color: #CCC;
  border-radius: v-bind(radius);
  outline: 1px solid black;
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
  font-size: 16px;
}
.label {
  position: absolute;
  translate: v-bind(labelTranslation);
  width: v-bind(diameter);
  text-align: center;
  font-size: 10px;
  color: black;
  user-select: none;
}
</style>