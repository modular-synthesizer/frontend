<template>
  <v-alert type="error" variant="outlined">
    <v-alert-title>Erreurs dans le formulaire</v-alert-title>
    <div v-for="error in errors">
      <template v-if="error.$validator === '$externalResults'">
        {{ $t(`errors.${error.$property}.${error.$message}`) }}
      </template>
      <template v-else>
        {{ $t(`errors.${error.$property}.${error.$validator}`) }}
      </template>
    </div>
  </v-alert>
</template>

<script lang="ts">
export default {
  props: {
    errors: {
      type: Array<any>,
      default: () => []
    }
  }
}
</script>