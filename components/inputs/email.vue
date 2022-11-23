<template>
  <v-text-field
    :label="$t('register.labels.email')"
    :hint="$t('register.hints.email')"
    :placeholder="$t('register.placeholders.email')"
    :rules="[required, format]"
    type="email"
    v-model="modelValue"
    @update:modelValue="notifyChange"
    variant="outlined"
  ></v-text-field>
</template>

<script lang="ts">
import { EMAIL_FORMAT } from "~~/lib/utils/constants";

export default {
  props: {
    /**
     * Do not directly pass this props as it is used to make the
     * v-model available when instanciating this component.
     */
    _modelValue: {
      type: String,
      required: true
    }
  },
  computed: {
    modelValue: {
      get() { return this._modelValue },
      set() { this.notifyChange() }
    }
  },
  methods: {
    err(type: string) {
      return this.$t(`errors.email.${type}`)
    },
    // Transmits the value above for the use of the v-model.
    notifyChange(value: String) {
      this.$emit('update:modelValue', value)
    },
    required() {
      return this.modelValue.length > 0 || this.err('required')
    },
    format() {
      return this.modelValue.match(EMAIL_FORMAT) || this.err('format')
    }
  }
}
</script>