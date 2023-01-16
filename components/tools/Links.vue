<template>
  <v-form class="mt-5">
    <v-row>
      <v-col cols="3">
        <v-text-field density="comfortable" variant="outlined" v-model="link.from.node" label="Depuis le noeud" />
      </v-col>
      <v-col cols="2">
        <v-text-field density="comfortable" variant="outlined" v-model="link.from.index" type="number" label="Index" />
      </v-col>
      <v-col cols="3">
        <v-text-field density="comfortable" variant="outlined" v-model="link.to.node" label="Vers le noeud" />
      </v-col>
      <v-col cols="2">
        <v-text-field density="comfortable" variant="outlined" v-model="link.to.index" type="number" label="Index" />
      </v-col>
      <v-col cols="2">
        <v-btn color="blue-grey-lighten-5" size="large" @click="addLink">Valider</v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-row>
    <v-col cols="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th>UUID</th>
            <th>Depuis</th>
            <th>Vers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(link, idx) in links">
            <td>{{ link.id }}</td>
            <td>{{ link.from.node }}.{{ link.from.index }}</td>
            <td>{{ link.to.node }}.{{ link.to.index }}</td>
            <td>
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="deleteLink(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">import { cloneDeep } from 'lodash';
import { InnerLink } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Array<InnerLink>,
      default: () => []
    }
  },
  data: () => ({
    link: {
      id: "", from: {node: "", index: 0}, to: {node: "", index: 0}
    } as InnerLink,
  }),
  computed: {
    links() { return this.modelValue; }
  },
  methods: {
    deleteLink(idx: number) {
      this.links.splice(idx, 1);
    },
    addLink() {
      this.links.push(cloneDeep(this.link));
    }
  }
}
</script>