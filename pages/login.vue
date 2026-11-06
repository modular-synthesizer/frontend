<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="8" lg="4" offset-sm="2" offset-lg="4">
        <div class="text-h2 mb-5">{{ $t('login.title') }}</div>
        <v-form @submit.prevent="submitLogin">
          <div class="mb-5">
            <v-alert type="error" variant="outlined" v-if="errors.length">
              <v-alert-title>Erreurs dans le formulaire</v-alert-title>
              <div v-for="error in errors">{{ $t(`errors.${error.field}.${error.reason}`) }}</div>
            </v-alert>
          </div>
          <v-text-field
            :label="$t('register.labels.username')"
            :hint="$t('login.hints.username')"
            :placeholder="$t('register.placeholders.username')"
            variant="outlined"
            v-model="account.username"
            autocomplete="username"
            class="mb-3"
          />
          <v-text-field
            :label="$t('register.labels.password')"
            :hint="$t('login.hints.password')"
            :placeholder="$t('register.placeholders.password')"
            type="password"
            variant="outlined"
            v-model="account.password"
            autocomplete="current-password"
            class="mb-3"
          />
          <v-btn color="primary" type="submit" :disabled="loading" icon>
            <v-progress-circular indeterminate v-if="loading" />
            <v-icon v-else>mdi-check</v-icon>
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { Credentials } from '~/features/sessions/core/data/Credentials.type';
import type { LoginError } from '~/features/sessions/core/data/LoginError.type';
import { login } from '~/features/sessions/shell/legacy/login.adapter';

definePageMeta({ middleware: ['already-logged'] });

const account: Ref<Credentials> = ref({ username: '', password: '' });

const loading: Ref<boolean> = ref(false);

const errors: Ref<LoginError[]> = ref([])

async function submitLogin() {
  loading.value = true
  login(account.value)
    .then(err => errors.value = err)
    .finally(() => loading.value = false)
}
</script>