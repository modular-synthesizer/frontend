<template>
  <v-btn v-if="language === 'fr'" icon @click="($i18n.locale = 'en') && storeLocale('en')">
    <CountryFlag iso="GB" />
  </v-btn>
  <v-btn v-else icon @click="($i18n.locale = 'fr') && storeLocale('fr')">
    <CountryFlag iso="FR" />
  </v-btn>
</template>

<script setup lang="ts">
import CountryFlag from 'vue3-country-flag-icon'
import 'vue3-country-flag-icon/dist/CountryFlag.css'

let language = ref(localStorage.getItem("lang") || 'fr');

function storeLocale(locale: string) {
  localStorage.setItem("lang", locale);
  language.value = locale;
}

</script>