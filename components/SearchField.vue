<template>
  <v-form @submit.prevent.stop="emit('search', search)">
    <v-text-field
      density="compact"
      variant="outlined"
      v-model="search"
      :label="label"
      append-inner-icon="mdi-magnify"
      @click:append-inner="emit('search', search)"
    />
  </v-form>
</template>

<script lang="ts" setup>
import { Ref } from "vue";

const search: Ref<string> = ref('');
const emit = defineEmits<{search: [query: string]}>();
const { label } = defineProps({ label: String })
</script>