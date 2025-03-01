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
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import type { LoginAttempt } from '~/types/authentication/Account';

definePageMeta({ middleware: ['already-logged'] });

const account: Ref<LoginAttempt> = ref({ username: '', password: '' });

const $externalResults: Ref<Record<string, string>> = ref({})

const rules = computed(() => ({
  username: { required, minsize: minLength(6) },
  password: { required }
}));

const v$ = useVuelidate(rules, account, { $externalResults });

const loading: Ref<boolean> = ref(false);

async function submitLogin() {
  await v$.value.$validate();
  if (v$.value.$error) return;
  loading.value = true;
  useSession().authenticate(account.value.username, account.value.password)
    .catch((error: any) => {
        const [ key, message ]: [ string, string ] = error.statusMessage.split('.');
        $externalResults.value = { [key]: message };
        loading.value = false;
    });
}
</script>