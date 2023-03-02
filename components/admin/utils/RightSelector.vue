<template>
  <v-switch
    class="without-messages"
    inset
    color="primary"
    density="compact"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', modelValue)"
  />
</template>

<script lang="ts">
export default {
  props: {
    modelValue: {
      type: Array
    }
  }
}
</script>

<style>
.without-messages .v-input__details {
  display: none;
}
</style>