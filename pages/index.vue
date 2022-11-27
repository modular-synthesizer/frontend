<template>
  <v-container>
    <v-row>
      <v-col :offset="3" :cols="6">
        <div class="text-h3">Synple</div>
        <div class="text-h6 text-grey-lighten-1">Modular synthesis made easier, on a web browser</div>

        <v-alert type="info" class="mt-5">Texte de présentation en cours de rédaction</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Menu from '~~/components/structure/menu.vue'

definePageMeta({
  authenticated: false
})
export default {
  components: { Menu }
}
</script>