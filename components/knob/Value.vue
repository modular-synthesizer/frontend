<template>
    <text
      :class="['value', { small }, 'fill-grey-lighten-2', 'stroke-grey-lighten-1']"
      :x="x"
      :y="y + (small ? 2 : 5)"
      text-anchor="middle"
      alignment-baseline="middle"
    >
      <slot :value="value">
        {{ value }}
      </slot>
    </text>
</template>

<script setup lang="ts">
const { value, small, x, y } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0},
  small: { type: Boolean, default: false },
  value: { type: Number, default: 0 },
});
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
</style>