<template>
  <VAppBar color="primary">
    <VAppBarTitle>Modusynth</VAppBarTitle>
    <template v-slot:prepend>
      <VBtn icon to="/"><VIcon>mdi-home</VIcon></VBtn>
      <template v-if="authenticated">
        <VBtn icon to="/synthesizers">
          <VIcon>mdi-piano</VIcon>
        </VBtn>
      </template>
    </template>
    <template v-slot:append>
      <VBtn to="/admin" v-if="admin">Administrer</VBtn>
      <VBtn @click="logout" v-if="authenticated">Se déconnecter</VBtn>
      <template v-else>
        <VBtn to="/register">S'inscrire</VBtn>
        <VBtn to="/login">Se connecter</VBtn>
      </template>
    </template>
  </VAppBar>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { VAppBar, VAppBarTitle } from 'vuetify/components'
import { useAuthentication } from '~~/lib/stores/authentication';

export default {
  component: { VAppBar, VAppBarTitle, },
  computed: {
    ...mapState(useAuthentication, ['authenticated', 'admin']),
  },
  methods: {
    ...mapActions(useAuthentication, ['logout'])
  }
}
</script>