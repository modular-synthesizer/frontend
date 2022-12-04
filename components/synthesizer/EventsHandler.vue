<template>
  <svg
    @mousedown="mousedown"
    @touchstart="touchstart"
    @mousemove="mousemove"
    @touchmove="touchmove"
    @mouseup="endDrags"
    @mouseleave="endDrags"
    @touchend="endDrags"
    @wheel.prevent="setScale($event.deltaY)"
  >
    <slot></slot>
  </svg>
</template>

<script lang="ts">
export default {

}
</script>