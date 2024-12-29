<template>
  <form @submit.prevent="validate">
    <v-text-field
      density="compact"
      variant="outlined"
      v-model="refValue"
      @change="onChange"
      :label="t(label)"
      :append-inner-icon="icon"
      @click:append-inner="validate"
      :hint="t(hint)"
    />
  </form>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { modelValue, hint, label, icon } = defineProps({
  modelValue: { type: String, required: true },
  hint: { type: String, default: '' },
  label: { type: String, default: '' },
  icon: { type: String, default: 'mdi-plus' }
});

type Emits = {
  'update:modelValue': [ string ],
  'submitted': [ string ],
}

const emit = defineEmits<Emits>();

const { t } = useI18n();

const refValue = ref('')

function validate() {
  emit('submitted', refValue.value)
}

function onChange() {
  emit('update:modelValue', refValue.value);
}
</script>