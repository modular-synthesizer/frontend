<template>
  <v-app>
    <v-layout>
      <nuxt-layout>
        <nuxt-page />
        <v-snackbar-queue v-model="useSnack().queue.value">
          <template #text="{ item }">{{ $t(item.text) }}</template>
        </v-snackbar-queue>
        <dialog-parameter-edition />
      </nuxt-layout>
    </v-layout>
  </v-app>
</template>

<style>
html { overflow: auto; }
</style>