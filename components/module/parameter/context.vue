<template>
  <div :style="{top: `${y}px`, left: `${x}px`}" v-if="display" class="menu-wrapper" v-click-outside="clickConfig">
    <v-list density="compact">
      <v-list-item>Edit</v-list-item>
      <v-list-item>Bind MIDI knob</v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';

export default {
  computed: {
    ...mapState(useContextMenus, ['x', 'y', 'displayed']),
    clickConfig() {
      return {
        handler: () => useContextMenus().hide(),
        events: ['mousedown']
      }
    },
    display() {
      return this.displayed === "parameters"
    }
  }
}
</script>