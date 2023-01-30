<template>
  <v-container>
    <v-row no-gutters>
      <v-col xs="16" sm="10" md="8" offset-sm="1" offset-md="2">
        <template v-if="registered">
          <v-row>
            <v-col cols="12">
              <v-alert type="success">
                {{ $t('register.messages.success') }}
              </v-alert>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col cols="12">
              <div class="text-h3 mb-4">{{ $t('register.title') }}</div>
            </v-col>
          </v-row>
          <v-row v-if="duplicates != ''">
            <v-col cols="12">
              <v-alert type="error" class="mb-2">
                {{ $t(duplicates) }}
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                :label="$t('register.labels.username')"
                :hint="$t('register.hints.username')"
                :placeholder="$t('register.placeholders.username')"
                variant="outlined"
                v-model="account.username"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="$t('register.labels.email')"
                :hint="$t('register.hints.email')"
                :placeholder="$t('register.placeholders.email')"
                type="email"
                v-model="account.email"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                :label="$t('register.labels.password')"
                :hint="$t('register.hints.password')"
                type="password"
                variant="outlined"
                v-model="account.password"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="$t('register.labels.password')"
                :hint="$t('register.hints.password')"
                type="password"
                variant="outlined"
                v-model="account.password_confirmation"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn class="mt-4" color="primary" @click="register">S'inscrire</v-btn>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"
import { api } from "~~/lib/api/Api"
import IApiError from "~~/lib/interfaces/IApiError"

definePageMeta({
  authenticated: false
})
export default {
  setup: () => ({
    v$: useVuelidate(),
  }),
  data() {
    return {
      account: {
        username: "",
        password: "",
        password_confirmation: "",
        email: ""
      },
      registered: false,
      duplicates: "",
    }
  },
  validations: () => ({
    account: {
      username: { required },
      password: { required },
      password_confirmation: { required },
      email: { required, email }
    }
  }),
  methods: {
    async register(_$event: Event) {
      this.v$.$validate();
      if(!this.v$.$error) {
        api.post('/accounts', this.account)
          .then(_response => this.registered = true)
          .catch(error => {
            const apiError: IApiError = error.response.data;
            if (apiError.message == 'uniq') {
              this.duplicates = `errors.${apiError.key}.uniq`
            }
          })
      }
    },
  }
}
</script>