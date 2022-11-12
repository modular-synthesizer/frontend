<template>
  <rect x="15" y="15" width="50" height="50" fill="#005500" />
</template>

<script lang="ts">import { PropType } from 'vue';
import IModule from '~~/lib/interfaces/IModule';

export default {
  name: "ProgrammableGain",
  props: {
    mod: {
      type: Object as PropType<IModule>,
      required: true
    }
  }
}
</script>