<template>
  <div>{{ modelValue }}</div>
</template>

<script lang="ts">
import { IControl } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Array<IControl>,
      default: () => []
    }
  }
}
</script>