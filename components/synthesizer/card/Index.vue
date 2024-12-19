<template>
  <v-card>
    <template v-slot:title>{{ synthesizer.name }}</template>
    <template v-slot:subtitle>{{ synthesizer.id }}</template>
    <template v-slot:text>
      <v-chip v-if="isReadOnly" color="red" text-color="white">{{ $t('common.readonly') }}</v-chip>
      <v-chip v-else-if="isCreator" color="green" text-color="white">Créé par vous</v-chip>
      <v-chip v-else color="blue" text-color="white">Vous pouvez l'éditer</v-chip>
    </template>
    <v-card-actions>
      <v-btn :to="`/synthesizers/${synthesizer.id}`" icon>
        <v-icon>mdi-music</v-icon>
        <v-tooltip activator="parent" location="bottom">{{ $t('common.play') }}</v-tooltip>
      </v-btn>
      <v-btn icon v-if="isCreator">
        <v-icon>mdi-account-multiple-plus</v-icon>
        <v-tooltip activator="parent" location="bottom">{{ $t('memberships.add') }}</v-tooltip>
        <v-dialog v-model="showMembers" activator="parent" width="50%">
          <v-card class="overflow-hidden">
            <v-card-title>{{ $t('common.members') }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <search-field @search="searchAccounts" label="Search users" />
                </v-col>
              </v-row>
              <v-row v-if="results">
                <v-col cols="12">
                  <v-list>
                    <template v-for="account in filteredResults">
                      <v-list-item :title="`${account.username}`" :subtitle="account.id">
                        <template v-slot:append>
                          <v-list-item-action>
                            <synthesizer-card-add-member :account="account" tooltip="Ajouter en lecture seule" @add="addMember" />
                            <synthesizer-card-add-member :account="account" tooltip="Ajouter un éditeur" @add="addMember" icon="plus-box-outline" type="write" />
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-col>
              </v-row>
              <v-row v-if="synthesizer.members.length">
                <v-col cols="12">
                  <synthesizer-card-members-list :synthesizer="synthesizer" @delete="remove" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
      <deletion-dialog
        v-if="isCreator"
        :url="`/synthesizers/${synthesizer.id}`"
        :text="`'${synthesizer.name}''`"
        @confirmed="emit('delete', synthesizer.id)"
        icon
      >
        {{ $t('common.delete') }}
      </deletion-dialog>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { Account } from '~/types/authentication/Account'
import type { Membership } from '~/types/synthesizers/Membership';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { isCreatorMember, isReadMember } from '~/utils/functions/synthesizers';
import { repositories } from '~~/lib/repositories';

const props = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true }
});

const emit = defineEmits<{ delete: [ id: string ] }>();

const showMembers = ref(false);

const account_ids = computed((): string[] => {
  return props.synthesizer.members.map((m: Membership) => m.account_id);
});

let results: Ref<Account[]> = ref([]);

async function searchAccounts(username: string) {
  results.value = await repositories.accounts.search(username);
}

const filteredResults = computed((): Account[] => {
  return results.value.filter((acc: Account) => !account_ids.value.includes(acc.id));
})

async function addMember(account_id: string, username: string, type: string) {
  const params: Membership = { account_id, synthesizer_id: props.synthesizer.id, type, id: '', username };
  await repositories.memberships.add(props.synthesizer.members)(params);
}

const remove: (id: string) => Promise<void> = repositories.memberships.remove(props.synthesizer.members);

const isReadOnly = computed(() => {
  return isReadMember(props.synthesizer, useAuthentication().username);
});

const isCreator = computed(() => {
  return isCreatorMember(props.synthesizer, useAuthentication().username);
});
</script>