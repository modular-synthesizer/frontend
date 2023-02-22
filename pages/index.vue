<template>
  <v-container>
    <v-img src="/images/synthesizer.jpg" height="400" cover>
      <v-overlay :no-click-animation="true" persistent contained v-model="overlay" scrim="primary" class="d-flex flex-column-reverse">
        <div class="ml-6 mb-4 d-flex flex-column-reverse">
          <div class="text-h5 text-grey-lighten-1 mt-4 lesser-stroke">La synthèse modulaire accessible à toutes et tous.</div>
          <div class="text-white text-h1 stroke">Synple</div>
        </div>
      </v-overlay>
    </v-img>
    <v-row class="mt-8">
      <v-col :xs="12" :class="descriptionsClasses">
        <v-card :width="descriptionsWidth" :class="itemClasses" color="grey-lighten-4" elevation="0">
          <v-card-text>
            <div class="text-h4 text-purple-darken-4">Simple</div>
            <div class="content-in-columns text-h5 mt-5 text-grey">
              Nous mettons tout en oeuvre pour que votre expérience soit la plus fluide possible. Vous savez cliquer-glisser ? C'est suffisant pour utiliser l'application !
            </div>
          </v-card-text>
        </v-card>
        <v-card :width="descriptionsWidth" :class="itemClasses" color="grey-lighten-4" elevation="0">
          <v-card-text>
            <div class="text-h4 text-purple-darken-4">Puissant</div>
            <div class="content-in-columns text-h5 mt-5 text-grey">
              Nous mettons à votre disposition un ensemble complet et divers d'outils afin que vous puissiez donner libre court à votre inspiration !
            </div>
          </v-card-text>
        </v-card>
        <v-card :width="descriptionsWidth" :class="itemClasses" color="grey-lighten-4" elevation="0">
          <v-card-text>
            <div class="text-h4 text-purple-darken-4">Personnalisable</div>
            <div class="content-in-columns text-h5 mt-5 text-grey">
              Malgré tous nos efforts, vous ne trouvez pas votre bonheur ? Pas de problème, créez vos propres modules simplement avec l'éditeur dédié !
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Menu from '~~/components/structure/menu.vue'
import { useDisplay } from 'vuetify'

definePageMeta({
  authenticated: false
})
export default {
  components: { Menu },
  data: () => ({
    overlay: true,
    mobile: useDisplay().mobile
  }),
  computed: {
    descriptionsClasses(): any {
      return {
        'd-flex': true,
        'flex-row': !this.mobile,
        'flex-column': this.mobile,
        'justify-space-around': true
      }
    },
    descriptionsWidth(): string {
      return this.mobile ? '100%' : '30%'
    },
    itemClasses(): any {
      return {
        'text-center': true,
        'mb-4': this.mobile,
      }
    }
  }
}
</script>

<style scoped>
.stroke {
  -webkit-text-stroke: 2px black;
}
.lesser-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, .25);
}
</style>