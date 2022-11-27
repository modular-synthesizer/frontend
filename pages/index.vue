<template>
  <v-container>
    <v-row>
      <v-col :offset-lg="3" :offset-md="1" :lg="6" :md="10">
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