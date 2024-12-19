<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="8" lg="4" offset-sm="2" offset-lg="4">
        <div class="text-h2 mb-5">{{ $t('login.title') }}</div>
        <v-form @submit.prevent="submitLogin">
          <div class="mb-5">
            <vuelidate-errors v-if="v$.$error" :errors="v$.$errors" />
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
          <v-btn color="primary" type="submit">{{ $t('login.button') }}</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import type { ApiError } from '~/types/ApiError';

definePageMeta({ middleware: ['already-logged'], layout: 'anonymous' });

const account = reactive({ username: '', password: '' });

const $externalResults = ref({})

const rules = computed(() => ({
  username: { required, minsize: minLength(6) },
  password: { required }
}));

const v$ = useVuelidate(rules, account, { $externalResults });

async function submitLogin() {
  const { username, password } = account;
  await v$.value.$validate();
  if (username === '' || password === '') return;
  useAuthentication().login(username, password)
    .catch((error: any) => {
        const { key, message }: ApiError = error.response.data;
        $externalResults.value = { [key]: message };
    });
}
</script>