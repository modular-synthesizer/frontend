<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Inscription</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <username v-model="account.username" />
      </v-col>
      <v-col cols="6">
        <v-text-field
          type="email"
          :label="$t('register.labels.email')"
          v-model="account.email"
          :hint="$t('register.hints.email')"
          :placeholder="$t('register.placeholders.email')"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          type="password"
          v-model="account.password"
          :hint="$t('register.hints.password')"
          :label="$t('register.labels.password')"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          type="password"
          v-model="account.password_confirmation"
          :hint="$t('register.hints.password_confirmation')"
          :label="$t('register.labels.password_confirmation')"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-btn @click="register">S'inscrire</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import username from '~/components/inputs/username.vue'
import Api from '~/lib/api/Api';
import IApiError from '~~/lib/interfaces/IApiError';

export default {
  components: { username },
  data() {
    return {
      account: {
        username: "",
        password: "",
        password_confirmation: "",
        email: ""
      },
      duplicates: {
        email: false,
        username: false
      },
      api: new Api(useRuntimeConfig())
    }
  },
  methods: {
    async register(_$event: Event) {
      this.api.post('/accounts')
        .catch(error => {
          const apiError = error.response.data as unknown as IApiError;
          if(apiError.message == 'uniq') {
            this.duplicates[apiError.key] = true;
          }
        })
    }
  }
}
</script>