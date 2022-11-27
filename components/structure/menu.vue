<template>
  <VAppBar color="primary">
    <template v-slot:prepend>
      <VAppBarTitle class="mr-2">Synple</VAppBarTitle>
      <VBtn icon to="/"><VIcon>mdi-home</VIcon></VBtn>
      <template v-if="authenticated">
        <VBtn icon to="/synthesizers">
          <VIcon>mdi-piano</VIcon>
        </VBtn>
      </template>
    </template>
    <template v-slot:append>
      <VBtn to="/admin" v-if="admin">{{ $t('common.admin') }}</VBtn>
      <VBtn @click="logout" v-if="authenticated">{{ $t('common.logout') }}</VBtn>
      <template v-else>
        <VBtn to="/register">{{ $t('common.register') }}</VBtn>
        <VBtn to="/login">{{ $t('common.login') }}</VBtn>
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