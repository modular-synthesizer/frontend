<template>
  <form @submit.prevent="validate">
    <v-text-field
      density="compact"
      variant="outlined"
      v-bind:modelValue="computedValue"
      @change="onChange"
      :label="translatedLabel"
      :append-inner-icon="icon"
      @click:append-inner="validate"
      :hint="translatedHint"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'SoloFieldForm',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'mdi-plus',
    },
  },
  computed: {
    translatedHint(): undefined | string {
      return this.hint === '' ? undefined : this.$t(this.hint);
    },
    translatedLabel(): undefined | string {
      return this.label === '' ? undefined : this.$t(this.label);
    },
    computedValue() {
      return this.modelValue;
    }
  },
  methods: {
    validate() {
      this.$emit('submitted', this.modelValue)
    },
    onChange($event: any) {
      this.$emit('update:modelValue', $event.target.value);
    }
  }
}
</script>