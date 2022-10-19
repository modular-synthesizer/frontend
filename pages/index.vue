<template>
  <v-container>
    <div class="text-h3">Modusynth</div>
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