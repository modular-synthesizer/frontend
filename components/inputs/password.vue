<template>
  <v-text-field
    :label="$t('register.labels.' + prefix)"
    :hint="$t('register.hints.' + prefix)"
    :rules="[required, confirmation]"
    v-model="modelValue"
    @update:modelValue="notifyChange"
    type="password"
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
    },
    /**
     * This value should only be used for password confirmations.
     * Do NOT pass it for a simple password field.
     */
    confirms: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    prefix(): string {
      return this.confirms === '' ? 'password' : 'password_confirmation'
    }
  },
  methods: {
    err(type: string) {
      return this.$t(`errors.${this.prefix}.${type}`)
    },
    // Transmits the value above for the use of the v-model.
    notifyChange(value: String) {
      this.$emit('update:modelValue', value)
    },
    required() {
      return this.modelValue.length > 0 || this.err('required')
    },
    confirmation() {
      return this.confirms == ""
        || this.confirms == this.modelValue
        || this.err('confirmation')
    }
  }
}
</script>