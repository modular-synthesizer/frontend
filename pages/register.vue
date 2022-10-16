<template>
  <v-container>
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
          <Username v-model="account.username" />
        </v-col>
        <v-col cols="6">
          <Email v-model="account.email" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <Password v-model="account.password" />
        </v-col>
        <v-col cols="6">
          <Password v-model="account.password_confirmation" :confirms="account.password" />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn class="mt-4" color="primary" @click="register">S'inscrire</v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import Password from '~/components/inputs/password.vue';
import Email from '~/components/inputs/email.vue';
import Username from '~/components/inputs/username.vue';
import IApiError from '~~/lib/interfaces/IApiError';

export default {
  components: { Email, Password, Username },
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
  methods: {
    async register(_$event: Event) {
      api.post('/accounts', this.account)
        .then(_response => this.registered = true)
        .catch(error => {
          const apiError: IApiError = error.response.data;
          if (apiError.message == 'uniq') {
            this.duplicates = `errors.${apiError.key}.uniq`
          }
        })
    }
  }
}
</script>