<template>
  <v-form v-model="form" v-if="group" @submit.prevent="save">
    <v-container>
      <v-row no-gutters class="mt-4">
        <v-col cols="6" offset="3">
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn variant="text" href="/groups"><v-icon icon="mdi-chevron-left" />&nbsp;Retour à la liste</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="group.slug" label="Nom du groupe" variant="outlined" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-switch v-model="group.is_default" label="groupe par défaut" inset color="primary" />
            </v-col>
          </v-row>
          <v-row no-gutters class="rights-row">
            <v-col cols="4" v-for="right in rights">
              <v-checkbox color="primary" v-model="selected" :value="right.id" :label="right.label" />
            </v-col>
          </v-row>
          <v-row class="pt-4">
            <v-col cols="12">
              <v-btn type="submit" color="primary">Save</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { api } from "~~/lib/api/Api"
import IRight from "~~/lib/interfaces/permissions/IRight";
import IGroup from "~~/lib/interfaces/permissions/IGroup";

const group: Ref<IGroup> = ref(await api.auth_get(`/groups/${useRoute().params.id}`));
const rights: IRight[] = await api.auth_get("/rights");
const selected: Ref<string[]> = ref(group.value.scopes.map((s: IRight) => s.id))
const form: Ref<any> = ref();

async function save() {
  group.value = await api.auth_put(`/groups/${useRoute().params.id}`, {
    slug: group.value.slug,
    scopes: selected.value,
  });
}
</script>

<style>
.rights-row .v-input__control {
  height: 36px;
}
.rights-row .v-input__details {
  display: none;
}
</style>