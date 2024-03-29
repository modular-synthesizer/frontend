<template>
  <v-card>
    <template v-slot:title>{{ synthesizer.name }}</template>
    <template v-slot:subtitle>{{ synthesizer.id }}</template>
    <template v-slot:text v-if="isReadOnly">
      <v-chip color="red" text-color="white" v-if="isReadOnly">{{ $t('common.readonly') }}</v-chip>
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
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    v-model="search"
                    label="Search users"
                    append-inner-icon="mdi-magnify"
                    @click:append-inner="accounts.refresh({ query: search })"
                  />
                </v-col>
              </v-row>
              <v-row v-if="accounts.populated">
                <v-col cols="12">
                  <div class="text-h6">{{ $t('memberships.results') }}</div>
                  <v-list>
                    <template v-for="account in accounts.all()">
                      <v-list-item
                        v-if="!usernames.includes(account.username)"
                        :title="`${account.username}`"
                        :subtitle="account.id"
                      >
                        <template v-slot:append>
                          <v-list-item-action>
                            <v-tooltip text="Ajouter en lecture seule" location="bottom">
                              <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" icon variant="text" @click="addMember(`${account.id}`, account.username, 'read')">
                                  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                              </template>
                            </v-tooltip>
                            <v-tooltip text="Ajouter un éditeur" location="bottom">
                              <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" icon variant="text" @click="addMember(`${account.id}`, account.username, 'write')">
                                  <v-icon>mdi-plus-box-outline</v-icon>
                                </v-btn>
                              </template>
                            </v-tooltip>
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-col>
              </v-row>
              <v-row v-if="members.populated">
                <v-col cols="12">
                  <div class="text-h6">{{ $t('memberships.existing') }}</div>
                  <v-list>
                    <template v-for="member in members.all()">
                      <v-list-item
                        v-if="member.type !== 'creator'"
                        :title="`${member.username}`"
                        :subtitle="member.id"
                      >
                        <template v-slot:append>
                          <v-list-item-action>
                            <v-btn icon variant="text" @click="members.delete(member.id)">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list>
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
        @confirmed="synthesizers.delete(synthesizer.id)"
        icon
      >
        {{ $t('common.delete') }}
      </deletion-dialog>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { api } from '~~/lib/api/Api';
import IMembership from '~~/lib/interfaces/IMembership';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

const props = defineProps({
  synthesizer: { type: Synthesizer, required: true }
});

const showMembers = ref(false);
const search = ref("");

const synthesizers = ref(await useLists().synthesizers);
const accounts = ref(await useLists().accounts);
const members = ref(await useMemberships(props.synthesizer));

const usernames = computed(() => {
  return members.value.all().map((m: IMembership) => m.username)
});

async function addMember(account_id: string, username: string, type: string) {
  const params = { account_id, synthesizer_id: props.synthesizer.id, type };
  const membership: any = await api.auth_post('/memberships', params);
  members.value.append({ ...membership, account_id, username } as IMembership);
}

const isReadOnly = computed(() => {
  return props.synthesizer?.isReadonly(useAuthentication()?.storedSession.username);
});

const isCreator = computed(() => {
  return props.synthesizer?.isCreator(useAuthentication()?.storedSession.username);
});
</script>