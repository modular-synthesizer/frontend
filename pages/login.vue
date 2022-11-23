<template>
  <v-form @submit.prevent="submitLogin">
    <v-container>
      <v-row>
        <v-col cols="6" offset="3">
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
        <v-col cols="6" offset="3">
          <v-text-field
            :label="$t('register.labels.username')"
            :hint="$t('register.hints.username')"
            :placeholder="$t('register.placeholders.username')"
            :rules="[requiredUsername, minSizeUsername]"
            variant="outlined"
            v-model="account.username"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" offset="3">
          <v-text-field
            :label="$t('register.labels.password')"
            :hint="$t('register.hints.password')"
            :rules="[requiredPassword]"
            type="password"
            variant="outlined"
            v-model="account.password"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" offset="3">
          <v-btn color="primary" type="submit">{{ $t('login.button') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
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
  methods: {
    ...mapActions(useAuthentication, ['login']),
    submitLogin() {
      this.login(this.account.username, this.account.password)
        .catch((error: any) => {
          const { key, message } = error.response.data;
          this.error = `errors.${key}.${message}`;
        })
    },
    requiredUsername() {
      return this.account.username.length > 0 || this.$t("errors.username.required");
    },
    minSizeUsername() {
      return this.account.username.length >= 6 || this.$t("errors.username.minsize");
    },
    requiredPassword() {
      return this.account.password.length > 0 || this.$t("errors.password.required");
    },
  }
}
</script>