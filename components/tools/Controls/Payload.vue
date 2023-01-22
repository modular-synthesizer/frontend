<template>
  <v-chip
    size="small"
    closable
    class="mr-1"
    v-for="key in chips"
    @click:close="$emit('closed', control, key)"
  >
    {{ key }} = {{ control.payload[key] }}
  </v-chip>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { IControl } from '~~/lib/interfaces/IControl';

export default {
  props: {
    control: {
      type: Object as PropType<IControl>,
      default: () => {}
    }
  },
  computed: {
    chips(): string[] {
      return Object.keys(this.control.payload).sort();
    },
  }
}
</script>