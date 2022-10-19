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
        <v-btn color="primary" @click="submitLogin">{{ $t('login.button') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Username from '~~/components/inputs/username.vue';
import Password from '~~/components/inputs/password.vue';
import { mapActions } from 'pinia';
import { useAuthentication } from '~~/lib/stores/authentication';

definePageMeta({
  authenticated: false
})
export default {
  data() {
    return {
      account: {
        username: "",
        password: ""
      },
      error: ""
    };
  },
  components: { Username, Password },
  methods: {
    ...mapActions(useAuthentication, ['login']),
    submitLogin() {
      this.login(this.account.username, this.account.password)
        .catch((error: any) => {
          const { key, message } = error.response.data;
          this.error = `errors.${key}.${message}`;
        })
    }
  }
}
</script>