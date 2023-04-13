<template>
  <form @submit.prevent="$emit('submitted', name)">
    <v-text-field
      density="comfortable"
      variant="outlined"
      v-model="name"
      :label="$t(t + '.labels.name')"
      append-inner-icon="mdi-plus"
      @click:append-inner="$emit('submitted', name)"
      :hint="$t(t + '.hints.name')"
    />
  </form>
</template>

<script lang="ts">
export default {
  props: {
    t: {
      type: String,
      default: "",
    }
  },
  data: function() {
    return {
      name: "",
    };
  },
  methods: {
    submit() {
      this.$emit('submitted', this.name);
      this.name = "";
    }
  },
}
</script>