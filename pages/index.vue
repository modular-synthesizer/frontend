<template>
  <v-container>
    <v-img src="/images/synthesizer.jpg" height="400" cover>
      <v-overlay :no-click-animation="true" persistent contained v-model="overlay" scrim="primary" class="d-flex flex-column-reverse">
        <div class="ml-6 mb-4 d-flex flex-column-reverse">
          <div class="text-h5 text-grey-lighten-1 mt-4 lesser-stroke">{{ $t('homepage.subtitle') }}</div>
          <div class="text-white text-h1 stroke">Synple</div>
        </div>
      </v-overlay>
    </v-img>
    <v-row class="mt-4">
      <v-col :xs="12" class="d-flex flex-column flex-md-row">
        <v-card :class="['text-center mb-4', {'ml-md-8': idx !== 0}]" color="grey-lighten-4" elevation="0" v-for="(block, idx) in blocks">
          <v-card-text>
            <div class="text-h4 text-purple-darken-4">{{ $t(`homepage.blocks.${block}.title`) }}</div>
            <div class="content-in-columns text-h5 mt-5 text-grey">{{ $t(`homepage.blocks.${block}.text`) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>



<script lang="ts" setup>
definePageMeta({ layout: 'anonymous' });

if (useAuthentication().authenticated) setPageLayout('default');

const blocks = ['simple', 'powerful', 'customizable'];

const overlay = ref(true);
</script>

<style scoped>
.stroke {
  -webkit-text-stroke: 2px black;
}
.lesser-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, .25);
}
</style>