<template>
  <VAppBar color="primary">
    <VAppBarTitle>Modusynth</VAppBarTitle>
    <template v-slot:prepend>
      <VBtn icon to="/"><VIcon>mdi-home</VIcon></VBtn>
    </template>
    <template v-if="loggedIn" v-slot:append>
      <VBtn @click="logout">Se déconnecter</VBtn>
    </template>
    <template v-else v-slot:append>
      <VBtn to="/register">S'inscrire</VBtn>
      <VBtn to="/login">Se connecter</VBtn>
    </template>
  </VAppBar>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { VAppBar, VAppBarTitle, VBtn } from 'vuetify/components'
import Api from '~~/lib/api/Api';
import { useLoginStore } from '~~/lib/stores/login';

export default {
  component: { VAppBar, VAppBarTitle, },
  data() {
    return {
      api: new Api(useRuntimeConfig())
    }
  },
  computed: {
    ...mapState(useLoginStore, ['loggedIn', 'token']),
  },
  methods: {
    ...mapActions(useLoginStore, ['removeToken']),
    logout() {
      this.api.delete(`/sessions/${this.token}`, {auth_token: this.token})
        .then(_response => {
          this.removeToken();
          navigateTo('/');
        })
    }
  }
}
</script>