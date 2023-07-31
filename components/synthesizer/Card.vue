<template>
  <v-card>
    <template v-slot:title>{{ synthesizer.name }}</template>
    <template v-slot:subtitle>{{ synthesizer.id }}</template>
    <v-card-actions>
      <v-btn :to="uri">Editer</v-btn>
      <deletion-dialog :url="`/synthesizers/${synthesizer.id}`" :text="`'${synthesizer.name}''`" @removed="fetchList">Supprimer</deletion-dialog>
      <v-btn icon>
        <v-icon>mdi-account-multiple-plus</v-icon>
        <v-dialog v-model="members" activator="parent" width="50%">
          <v-card class="overflow-hidden">
            <v-card-title>Members</v-card-title>
            <v-card-text>
              <v-row v-if="isCreator">
                <v-col cols="12">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    v-model="search"
                    label="Search users"
                    append-inner-icon="mdi-magnify"
                    @click:append-inner="searchUsers(search)"
                  />
                </v-col>
              </v-row>
              <v-row v-if="filteredItems.length">
                <v-col cols="12">
                  <div class="text-h6">Searched users</div>
                  <v-list>
                    <v-list-item 
                      v-for="item in filteredItems"
                      :title="`${item.username}`"
                      :subtitle="item.id">
                      <template v-slot:append>
                        <v-list-item-action>
                          <v-btn icon variant="text" @click="addUser(item)">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <v-row v-if="synthesizer.members.length">
                <v-col cols="12">
                  <div class="text-h6">Existing users</div>
                  <v-list>
                    <template v-for="member in synthesizer.members">
                      <v-list-item
                        v-if="member.type !== 'creator'"
                        :title="`${member.username}`"
                        :subtitle="member.id"
                      >
                        <template v-slot:append>
                          <v-list-item-action>
                            <v-btn icon variant="text" @click="remove(member)"><v-icon>mdi-delete</v-icon></v-btn>
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
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';
import { PropType } from 'vue';
import { api } from '~~/lib/api/Api';
import { find, includes, remove } from 'lodash';
import IMembership from '~~/lib/interfaces/IMembership';

export default {
  props: {
    synthesizer: {
      type: Object as PropType<ISynthesizer>,
      required: true,
    }
  },
  data() {
    return {
      members: false,
      search: "",
      items: []
    }
  },
  computed: {
    uri() {
      return `/synthesizers/${this.synthesizer.id}`
    },
    isCreator() {
      return useAccounts().account.username === this.creator.username
    },
    memberIds() {
      return this.synthesizer.members.map((m: IMembership) => m.account_id)
    },
    filteredItems(): IMembership[] {
      return this.items.filter((item: any) => {
        return !includes(this.memberIds, item.id);
      })
    },
    creator(): IMembership {
      return find(this.synthesizer.members, {type: 'creator'}) as IMembership;
    }
  },
  methods: {
    fetchList() {
      useSynthesizersList().fetch();
    },
    async searchUsers(query: string) {
      this.items = [];
      this.items = await api.auth_get('/accounts/search', { query });
    },
    async addUser({ id, username }: any) {
      const params = { account_id: id, synthesizer_id: this.synthesizer.id };
      const membership: any = await api.auth_post('/memberships', params);
      this.synthesizer.members.push({
        account_id: id,
        username: username,
        id: membership.id,
        type: membership.type
      } as IMembership);
    },
    remove(member: IMembership) {
      api.auth_delete(`/memberships/${member.id}`).then(() => {
        remove(this.synthesizer.members, member);
      })
    }
  }
}
</script>