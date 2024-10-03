<template>
  <v-alert type="error" variant="outlined">
    <v-alert-title>Erreurs dans le formulaire</v-alert-title>
    <div v-for="error in formattedErrors()">{{ $t(error) }}</div>
  </v-alert>
</template>

<script lang="ts" setup>
import { map, uniq } from 'lodash';

const props = defineProps({ errors: { type: Array<any>, default: () => [] }});

function formattedErrors() {
  const errors: string[] = map(props.errors, (error: any) => {
    if (error.$validator === '$externalResults') {
      return `errors.${error.$property}.${error.$message}`
    }
    else {
      return `errors.${error.$property}.${error.$validator}`
    }
  });
  return uniq(errors);
}
</script>