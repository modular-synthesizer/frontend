<template>
  <v-btn icon v-if="language === 'fr'" @click="($i18n.locale = 'en') && storeLocale('en')">
    EN
  </v-btn>
  <v-btn icon v-else @click="($i18n.locale = 'fr') && storeLocale('fr')">
    FR
  </v-btn>
</template>

<script setup lang="ts">
let language = ref(localStorage.getItem("lang") || 'fr');

function storeLocale(locale: string) {
  localStorage.setItem("lang", locale);
  language.value = locale;
}

</script>