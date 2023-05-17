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
            v-model="account.username"
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
  useAuthentication().login(account.username, account.password)
    .catch((error: any) => {
        const err: IApiError = error.response.data;
        $externalResults.value = { [err.key]: err.message };
    });
}
</script>