<template>
  <v-btn :icon="icon" :size="size" variant="text">
    <slot></slot>
    <v-dialog v-model="dialog" activator="parent" width="500">
      <v-card>
        <v-card-title>Validation de la suppression</v-card-title>
        <v-card-text>Voulez-vous vraiment supprimer {{ text }} ?</v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" color="grey-darken-1">Annuler</v-btn>
          <v-btn @click="remove" color="red-darken-2">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import { useSynthesizerDelete } from '~~/stores/synthesizers/delete';

export default {
  props: {
    icon: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: 'cet élément'
    },
    size: {
      type: String,
      default: "default"
    }
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    ...mapState(useSynthesizerDelete, ['displayDialog', 'mod']),
  },
  methods: {
    remove() {
      api.auth_delete(this.url).then(() => {
        this.$emit('removed')
      })
    }
  }
}
</script>