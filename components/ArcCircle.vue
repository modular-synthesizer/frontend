<template>
  <g class="arc-circle">
    <path :d="arcPath(x, y, r, as, ae)" stroke-width="2" class="stroke-grey-darken-2 fill-shades-transparent" />
    <path :d="arcPath(x, y, r, as, angle())" stroke-width="2" class="stroke-blue fill-shades-transparent" />
    <g :transform="`translate(${x} ${y})`">
      <g :transform="`rotate(${angle()})`">
        <circle cx="0" :cy="r" :r="ir" class="fill-blue" />
      </g>
    </g>
  </g>
</template>

<script lang="ts" setup>
type Props = {
  x: number,
  y: number,
  r: number,
  as?: number,
  ae?: number,
  value: number,
  min: number,
  max: number,
  ir: number
}
const props = defineProps<Props>();
console.log(props);
const {x, y, r, as = 30, ae = 330, value, min, max, ir } = props;

const val = reactive(ref(value));

function angle() {
  if (max === undefined || min === undefined) return as;
  return as + (ae / max * props.value)
};
</script>