<template>
  <div :style="{top: `${y}px`, left: `${x}px`}" v-if="display" class="menu-wrapper" v-click-outside="clickConfig">
    <v-list density="compact">
      <v-list-item @click="disconnectLinks">Disconnect</v-list-item>
      <v-list-item @click="deleteModule">Delete</v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';

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
      return this.displayed === "modules"
    }
  },
  methods: {
    ...mapActions(useModuleMenu, ['disconnectLinks', 'deleteModule']),
  }
}
</script>