<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Inscription</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          :label="$t('register.labels.username')"
          v-model="account.username"
          :hint="$t('register.hints.username')"
          :placeholder="$t('register.placeholders.username')"
        ></v-text-field>
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

<script lang="ts" setup>
import IAccount from '~/lib/interfaces/IAccount';
import Api from '~~/lib/api/Api';

const account: IAccount = {
  username: "",
  password: "",
  password_confirmation: "",
  email: ""
}
const api = new Api(useRuntimeConfig());
</script>

<script lang="ts">

export default {
  methods: {
    async register(_$event: Event) {
      console.log(this.api);
      this.api.get('/synthesizers')
        .catch(error => console.log(error.response.data))
    }
  }
}
</script>