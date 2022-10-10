<template>
  <v-text-field
    v-model="modelValue"
    :rules="[required, unicity, minsize]"
    :label="$t('register.labels.username')"
    :placeholder="$t('register.placeholders.username')"
    :hint="$t('register.hints.username')"
    @update:modelValue="$emit('update:modelValue', modelValue)"
  />
</template>

<script lang="ts">
export default {
  props: {
    // This prop allows the use of the v-model when invoking this component.
    modelValue: { type: String, required: true },
    // If this flag is TRUE, the username is already used on the application.
    duplicate: { type: Boolean, required: false, default: false}
  },
  methods: {
    required() {
      return !!this.modelValue || this.$t('errors.username.required')
    },
    unicity() {
      return !this.duplicate || this.$t('errors.username.duplicate')
    },
    minsize() {
      return this.modelValue.length > 5 || this.$t('errors.username.minsize')
    }
  }
}
</script>