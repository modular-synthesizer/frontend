<template>
  <circle :r="13" :cx="parameter.x" :cy="parameter.y" :fill="color" stroke="black" stroke-width="3" @click="trigger" />
</template>

<script lang="ts">
import Parameter from '~~/lib/wrappers/Parameter';

export default {
  props: {
    parameter: {
      type: Parameter,
      required: true
    }
  },
  data: () => ({
    baseValue: 1,
    muted: true
  }),
  computed: {
    color() {
      return this.muted ? 'red' : 'green'
    }
  },
  mounted() {
    this.baseValue = this.parameter.value
  },
  methods: {
    trigger() {
      this.muted = !this.muted;
      this.parameter.setValue(this.muted ? 0 : 1)
    }
  }
}
</script>