<template>
  <VAppBar color="primary">
    <template v-slot:prepend>
      <VAppBarTitle class="mr-2">Synple</VAppBarTitle>
      <VBtn icon to="/">
        <VIcon>mdi-home</VIcon>
      </VBtn>
      <VBtn icon to="/synthesizers">
        <VIcon>mdi-piano</VIcon>
      </VBtn>
    </template>
    <template v-slot:append>
      <template v-if="admin">
        <v-btn to="/admin/sandbox">Sandbox</v-btn>
        <v-btn to="/tools" >Outils</v-btn>
        <v-btn to="/admin">{{ $t('common.admin') }}</v-btn>
      </template>
      <VBtn @click="logout">{{ $t('common.logout') }}</VBtn>
    </template>
  </VAppBar>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { VAppBar, VAppBarTitle } from 'vuetify/components'

export default {
  component: { VAppBar, VAppBarTitle, },
  computed: {
    ...mapState(useAuthentication, ['admin']),
  },
  methods: {
    ...mapActions(useAuthentication, ['logout'])
  }
}
</script>