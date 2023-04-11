<template>
  <g v-on="events">
    <slot></slot>
  </g>
</template>

<script lang="ts">import { mapActions } from 'pinia';
import Parameter from '~~/lib/wrappers/Parameter';

export default {
  props: {
    parameter: {
      type: Parameter,
      required: true
    },
  },
  computed: {
    mobile() {
      return true;
    },
    events() {
      return {
        ...(this.mobile ? {} : {'mousedown': this.mousedown}),
        ...(this.mobile ? {'click': this.click} : {}),
      };
    },
  },
  methods: {
    ...mapActions(useParameters, ['startParameterSetting']),
    ...mapActions(useKnobEdition, ["toggleOverlay"]),
    mousedown(e: MouseEvent) {
      e.stopPropagation();
      this.startParameterSetting(e, this.parameter)
    },
    click(e: MouseEvent) {
      e.stopPropagation();
      this.toggleOverlay();
    }
  },
}
</script>