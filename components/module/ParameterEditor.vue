<template>
  <div :style="{'--top': top, '--left': left}" class="editor-wrapper" v-if="displayDialog">
    <v-card>
      <v-card-text>{{ displayDialog }}</v-card-text>
    </v-card>
  </div>
</template>

<script type="ts">
import { mapState } from 'pinia';
import { useKnobEdition } from "@/stores/knobs/edition"

export default {
  data: function() {
    return {
      displayed: true,
    }
  },
  computed: {
    ...mapState(useKnobEdition, ["displayDialog", "coordinates"]),
    top() { return this.coordinates.y + "px"; },
    left() { return this.coordinates.x + "px"; },
  },
}
</script>

<style scoped>
.editor-wrapper {
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: 400px;
  height: 400px;
}
</style>