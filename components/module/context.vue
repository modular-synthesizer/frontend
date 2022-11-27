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
import { useContextMenu } from '~~/lib/stores/mods/context';

export default {
  computed: {
    ...mapState(useContextMenu, ['x', 'y', 'display']),
    clickConfig() {
      return {
        handler: () => useContextMenu().hide(),
        events: ['dblclick', 'click', 'mousedown']
      }
    },
  },
  methods: {
    ...mapActions(useContextMenu, ['disconnectLinks', 'deleteModule']),
  }
}
</script>