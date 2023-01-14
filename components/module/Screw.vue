<template>
  <circle :cx="x" :cy="y" :r="r" fill="#BEBEBE" stroke="#999999" />
  <g :transform="`translate(${x - r} ${y})`">
    <g :transform="`rotate(${angle} ${r} 0)`">
      <rect x="2" :width="2 * (r - 2)" y="-1" height="2" fill="#EBEBEB" />
    </g>
  </g>
</template>

<script lang="ts">
export default {
  data() {
    return {
      angle: Math.round(Math.random() * 36) * 10,
      r: 6
    }
  },
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
}
</script>