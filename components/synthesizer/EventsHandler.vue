<script lang="ts">
/**
 * This component is made to isolate the events handling for an entire synthesizer stage. It allows us
 * to put all the code concerning drag'n'drop and zoom in/out here and not have it in the stage itself.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default {
  methods: {
    displayContext($event: MouseEvent) {
      useContexts().display($event, [
        {label: "First item"},
        {label: "Second item"}
      ])
    }
  }
}
</script>

<template>
  <svg
    @mousedown.left.stop="dragstart"
    @mousemove="dragmove"
    @mouseup.left.stop="dragend"
    @mouseleave="dragend"
    @touchend="dragend"
    @wheel.passive="wheel"
    @click.right.stop.prevent="displayContext"
  >
    <slot></slot>
  </svg>
</template>
