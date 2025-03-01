<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="8" offset-sm="2">
        <template v-if="registered">
          <v-alert type="success">
            {{ $t('register.messages.success') }}
          </v-alert>
        </template>
        <template v-else>
          <div class="text-h3 mb-5">{{ $t('register.title') }}</div>
          <v-form @submit.prevent="register">
            <div class="mb-5">
              <vuelidate-errors v-if="v$.$error" :errors="v$.$errors" />
            </div>
            <v-row no-gutters>
              <v-col :cols="12" :md="6" class="pr-md-2">
                <v-text-field
                  :label="$t('register.labels.username')"
                  :hint="$t('register.hints.username')"
                  :placeholder="$t('register.placeholders.username')"
                  variant="outlined"
                  v-model="account.username"
                  class="mb-3"
                />
              </v-col>
              <v-col :cols="12" :md="6" class="pl-md-2">
                <v-text-field
                  :label="$t('register.labels.email')"
                  :hint="$t('register.hints.email')"
                  :placeholder="$t('register.placeholders.email')"
                  type="email"
                  v-model="account.email"
                  variant="outlined"
                  class="mb-3"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col :cols="12" :md="6" class="pr-md-2">
                <v-text-field
                  :label="$t('register.labels.password')"
                  :hint="$t('register.hints.password')"
                  type="password"
                  variant="outlined"
                  v-model="account.password"
                  class="mb-3"
                />
              </v-col>
              <v-col :cols="12" :md="6" class="pl-md-2">
                <v-text-field
                  :label="$t('register.labels.password')"
                  :hint="$t('register.hints.password')"
                  type="password"
                  variant="outlined"
                  v-model="account.password_confirmation"
                  class="mb-3"
                />
              </v-col>
            </v-row>
            <v-btn color="primary" type="submit">{{ $t('register.button') }}</v-btn>
          </v-form>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { email, minLength, required } from '@vuelidate/validators';
import { split } from 'lodash';
import { repositories } from '~~/lib/repositories';

definePageMeta({ middleware: ['already-logged'] });

const account = reactive({
  id: '',
  username: '',
  password: '',
  password_confirmation: '',
  email: '',
});

const $externalResults = ref({});

const rules = computed(() => ({
  username: { required, length: minLength(6) },
  password: { required },
  password_confirmation: { required, confirmation: (v: string) => v === account.password },
  email: { required, format: email }
}));

const v$ = useVuelidate(rules, account, { $externalResults });

const registered = ref(false);

function hasEmptyFields() {
  return account.username === '' ||
    account.password === '' ||
    account.password_confirmation === '' ||
    account.email === ''
}

async function register(_$event: Event) {
  await v$.value.$validate();
  if (hasEmptyFields()) return;
  try {
    await repositories.accounts.create(account);
    registered.value = true
  }
  catch (error: any) {
    const [ key, message ] = split(error.statusMessage, '.');
    $externalResults.value = {[key]: message};
  }
}
</script>