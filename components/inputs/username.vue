<template>
  <v-text-field
    :label="$t('register.labels.username')"
    :hint="$t('register.hints.username')"
    :placeholder="$t('register.placeholders.username')"
    :rules="[required, minSize]"
    v-model="modelValue"
    @update:modelValue="notifyChange"
    variant="outlined"
  ></v-text-field>
</template>

<script lang="ts">
export default {
  props: {
    /**
     * Do not directly pass this props as it is used to make the
     * v-model available when instanciating this component.
     */
    modelValue: {
      type: String,
      required: true
    }
  },
  methods: {
    err(type: string) {
      return this.$t(`errors.username.${type}`)
    },
    // Transmits the value above for the use of the v-model.
    notifyChange(value: String) {
      this.$emit('update:modelValue', value)
    },
    required() {
      return this.modelValue.length > 0 || this.err('required');
    },
    minSize() {
      return this.modelValue.length >= 6 || this.err('minsize');
    }
  }
}
</script>