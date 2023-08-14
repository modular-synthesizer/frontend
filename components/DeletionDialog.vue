<template>
  <v-btn :icon="icon" :size="size" variant="text">
    <template v-if="icon">
      <v-tooltip activator="parent" location="bottom">
        <slot></slot>
      </v-tooltip>
      <v-icon color="red">mdi-delete</v-icon>
    </template>
    <slot v-else></slot>
    <v-dialog v-model="dialog" activator="parent" width="500">
      <v-card>
        <v-card-title>Validation de la suppression</v-card-title>
        <v-card-text>Voulez-vous vraiment supprimer {{ text }} ?</v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" color="grey-darken-1">Annuler</v-btn>
          <v-btn @click="$emit('confirmed'); dialog = false" color="red-darken-2">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script lang="ts" setup>
defineProps({
  icon: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: 'cet élément'
  },
  size: {
    type: String,
    default: "default"
  },
});

const dialog = ref(false);
</script>