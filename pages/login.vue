<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h2 mb-2">Connexion</div>
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
        <v-btn color="primary" @click="login">Se connecter</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Username from '~~/components/inputs/username.vue';
import Password from '~~/components/inputs/password.vue';
import Api from '~~/lib/api/Api';

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
  methods: {
    login() {
      this.api.post('/sessions', this.account)
        .then(response => {
          localStorage.setItem('token', response.data.token);
        })
        .catch(error => {
          this.error = `errors.${error.key}.${error.message}`
        })
    }
  }
}
</script>