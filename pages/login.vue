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
            :hint="$t('register.hints.username')"
            :placeholder="$t('register.placeholders.username')"
            variant="outlined"
            v-model="account.username"
          />
          <v-text-field
            :label="$t('register.labels.password')"
            :hint="$t('register.hints.password')"
            type="password"
            variant="outlined"
            v-model="account.password"
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
import IApiError from '~~/lib/interfaces/IApiError';

definePageMeta({ middleware: ['already-logged'], layout: 'anonymous' });

const account = reactive({ username: '', password: '' });

const $externalResults = ref({})

const rules = computed(() => ({
  username: { required, minsize: minLength(6) },
  password: { required }
}));

const v$ = useVuelidate(rules, account, { $externalResults });

async function submitLogin() {
  await v$.value.$validate();
  if (account.username === '' || account.password === '') return;
  useAuthentication().login(account.username, account.password)
    .catch((error: any) => {
        const err: IApiError = error.response.data;
        $externalResults.value = { [err.key]: err.message };
    });
}
</script>