<script lang="ts">
/**
 * This component is made to isolate the events handling for an entire synthesizer stage. It allows us
 * to put all the code concerning drag'n'drop and zoom in/out here and not have it in the stage itself.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default { }
</script>

<template>
  <svg
    @mousedown="dragstart"
    @mousemove="dragmove"
    @mouseup="dragend"
    @mouseleave="dragend"
    @touchend="dragend"
    @wheel.passive="wheel"
  >
    <slot></slot>
  </svg>
</template>
