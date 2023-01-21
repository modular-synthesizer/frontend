<template>
  <v-row>
    <v-col cols="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th v-if="!creationMode">UUID</th>
            <th>Depuis</th>
            <th>Vers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(link, idx) in links">
            <td v-if="!creationMode">{{ link.id }}</td>
            <td>{{ link.from.node }}.{{ link.from.index }}</td>
            <td>{{ link.to.node }}.{{ link.to.index }}</td>
            <td>
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removeLink(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { InnerLink } from '~~/lib/interfaces/ITool';

export default {
  props: {
    links: {
      type: Array<InnerLink>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false,
    }
  },
  methods: {
    removeLink(index: number) {
      this.links.splice(index, 1)
    }
  }
}
</script>