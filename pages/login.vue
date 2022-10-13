<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h2 mb-2">{{ $t('login.title') }}</div>
      </v-col>
    </v-row>
    <v-row v-if="error != ''">
      <v-col cols="12">
        <v-alert type="error">
          {{ $t(error) }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <Username v-model="account.username" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <Password v-model="account.password" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="login">{{ $t('login.button') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Username from '~~/components/inputs/username.vue';
import Password from '~~/components/inputs/password.vue';
import Api from '~~/lib/api/Api';
import { useLoginStore } from '~~/lib/stores/login';
import { mapActions, mapStores } from 'pinia';

export default {
  data() {
    return {
      account: {
        username: "",
        password: ""
      },
      api: new Api(useRuntimeConfig()),
      error: ""
    };
  },
  components: { Username, Password },
  computed: {
    ...mapStores(useLoginStore)
  },
  methods: {
    ...mapActions(useLoginStore, ['setToken']),
    login() {
      this.api.post('/sessions', this.account)
        .then(response => {
          this.setToken(response.token);
          navigateTo('/')
        })
        .catch(error => {
          const { key, message } = error.response.data
          this.error = `errors.${key}.${message}`
        })
    }
  }
}
</script>