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
          <v-row class="mb-2">
            <v-col cols="12">
              <vuelidate-errors v-if="v$.$error" :errors="v$.$errors" />
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="12" :md="6">
              <v-text-field
                :label="$t('register.labels.username')"
                :hint="$t('register.hints.username')"
                :placeholder="$t('register.placeholders.username')"
                variant="outlined"
                v-model="account.username"
              ></v-text-field>
            </v-col>
            <v-col :cols="12" :md="6">
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
            <v-col :cols="12" :md="6">
              <v-text-field
                :label="$t('register.labels.password')"
                :hint="$t('register.hints.password')"
                type="password"
                variant="outlined"
                v-model="account.password"
              ></v-text-field>
            </v-col>
            <v-col :cols="12" :md="6">
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

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { email, required, sameAs } from '@vuelidate/validators';
import { api } from '~~/lib/api/Api';
import IApiError from '~~/lib/interfaces/IApiError';

definePageMeta({ middleware: ['already-logged'], layout: 'anonymous' });

const account = reactive({
  username: '',
  password: '',
  password_confirmation: '',
  email: '',
});

const $externalResults = ref({});

const rules = computed(() => ({
  username: { required },
  password: { required },
  password_confirmation: { required, confirmation: sameAs('password') },
  email: { required, format: email }
}));

const v$ = useVuelidate(rules, account, { $externalResults });

const registered = ref(false);

async function register(_$event: Event) {
  await v$.value.$validate();
  api.post('/accounts', account)
    .then(_response => registered.value = true)
    .catch(error => {
      const err: IApiError = error.response.data;
      $externalResults.value = {[err.key]: err.message};
    });
}
</script>