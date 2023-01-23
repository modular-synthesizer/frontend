<template>
  <circle :r="13" :cx="x" :cy="y" :fill="color" stroke="black" stroke-width="3" @click="trigger" />
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import Mod from '~~/lib/wrappers/Mod';

export default {
  name: 'MuteButton',
  props: {
    mod: { type: Mod, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    target: { type: String, required: true }
  },
  data: () => ({
    baseValue: 1,
    muted: true
  }),
  computed: {
    color() {
      return this.muted ? 'red' : 'green'
    },
    parameter() {
      return this.mod.param(this.target);
    }
  },
  mounted() {console.log(this.mod, this.target, this.mod.param(this.target))
    this.baseValue = this.parameter.value;
    this.muted = Math.round(this.parameter.value) == 0;
  },
  methods: {
    trigger() {
      this.muted = !this.muted;
      this.parameter.setValue(this.muted ? 0 : 1);
      const payload = {
        auth_token: useAuthentication().session.token,
        parameters: [{id: this.parameter.id, value: this.parameter.value}]
      }
      api.put(`/modules/${this.parameter.mod.id}`, payload)
    }
  }
}
</script>