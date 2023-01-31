<template>
  <v-form @submit.prevent="submitLogin">
    <v-container>
      <v-row>
        <v-col cols="6" offset="3">
          <div class="text-h2 mb-2">{{ $t('login.title') }}</div>
        </v-col>
      </v-row>
      <v-row class="mb-2">
        <v-col cols="6" offset="3">
          <vuelidate-errors v-if="v$.$error" :errors="v$.$errors" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" offset="3">
          <v-text-field
            :label="$t('register.labels.username')"
            :hint="$t('register.hints.username')"
            :placeholder="$t('register.placeholders.username')"
            variant="outlined"
            v-model="v$.account.username.$model"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" offset="3">
          <v-text-field
            :label="$t('register.labels.password')"
            :hint="$t('register.hints.password')"
            type="password"
            variant="outlined"
            v-model="v$.account.password.$model"
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
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { mapActions } from 'pinia';
import IApiError from '~~/lib/interfaces/IApiError';

definePageMeta({
  authenticated: false
})
export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      vuelidateExternalResults: {
        account: {
          username: [],
          email: [],
        },
      },
      account: {
        username: "",
        password: ""
      },
      error: ""
    };
  },
  validations: {
    account: {
      username: { required, minsize: minLength(6) },
      password: { required }
    }
  },
  methods: {
    ...mapActions(useAuthentication, ['login']),
    submitLogin() {
      this.v$.$validate();
      this.login(this.account.username, this.account.password)
        .catch((error: any) => {
            const err: IApiError = error.response.data;
            Object.assign(this.vuelidateExternalResults.account, {
              [err.key]: [err.message],
            });
        })
    },
  }
}
</script>