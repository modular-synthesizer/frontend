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
          <v-form @submit.prevent="submitRegistration">
            <div class="mb-5">
              <v-alert type="error" variant="outlined" v-if="errors.length">
                <v-alert-title>{{ $t("register.errors") }}</v-alert-title>
                <div v-for="error in errors" :key="`errors.${error.field}.${error.reason}`">
                  {{ $t(`errors.${error.field}.${error.reason}`) }}
                </div>
              </v-alert>
            </div>
            <v-row no-gutters>
              <v-col :cols="12" :md="6" class="pr-md-2">
                <v-text-field
                  :label="$t('register.labels.username')"
                  :hint="$t('register.hints.username')"
                  :placeholder="$t('register.placeholders.username')"
                  variant="outlined"
                  v-model="registration.username"
                  class="mb-3"
                />
              </v-col>
              <v-col :cols="12" :md="6" class="pl-md-2">
                <v-text-field
                  :label="$t('register.labels.email')"
                  :hint="$t('register.hints.email')"
                  :placeholder="$t('register.placeholders.email')"
                  type="email"
                  v-model="registration.email"
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
                  v-model="registration.password"
                  class="mb-3"
                />
              </v-col>
              <v-col :cols="12" :md="6" class="pl-md-2">
                <v-text-field
                  :label="$t('register.labels.password_confirmation')"
                  :hint="$t('register.hints.password_confirmation')"
                  type="password"
                  variant="outlined"
                  v-model="registration.password_confirmation"
                  class="mb-3"
                />
              </v-col>
            </v-row>
            <v-btn color="primary" type="submit" :disabled="loading">{{ $t('register.button') }}</v-btn>
          </v-form>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { Registration } from '~/features/accounts/core/data/Registration.type'
import type { RegistrationError } from '~/features/accounts/core/data/RegistrationError.type'
import { register } from '~/features/accounts/shell/legacy/register.adapter'

definePageMeta({ middleware: ['already-logged'] })

const registration: Ref<Registration> = ref({
  username: '',
  password: '',
  password_confirmation: '',
  email: '',
})

const errors: Ref<RegistrationError[]> = ref([])

const loading: Ref<boolean> = ref(false)

const registered: Ref<boolean> = ref(false)

function submitRegistration(_$event: Event) {
  loading.value = true
  register(registration.value)
    .then(err => {
      errors.value = err.ok ? [] : err.error()
      registered.value = err.ok
    })
    .finally(() => loading.value = false)
}
</script>