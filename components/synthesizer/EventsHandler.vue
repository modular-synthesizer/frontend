<script lang="ts">
import { mapActions } from 'pinia';

/**
 * This component is made to isolate the events handling for an entire synthesizer stage. It allows us
 * to put all the code concerning drag'n'drop and zoom in/out here and not have it in the stage itself.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default {
  methods: {
    displayContext($event: MouseEvent) {
      useContexts().display($event, {
        items: [
          {label: "Reset position", action: useSynthesizerDrag().reset},
          {label: "Reset zoom level", action: useZoomStore().reset },
        ]
      })
    },
    ...mapActions(useContexts, ['hide'])
  }
}
</script>

<template>
  <svg
    @mousedown.left.stop="hide(); dragstart($event)"
    @mousedown.right.stop="hide"
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
