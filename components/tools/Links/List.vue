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
            <td>{{ link.from }}</td>
            <td>{{ link.to }}</td>
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
import { PropType } from 'nuxt/dist/app/compat/capi';
import { api } from '~~/lib/api/Api';
import ITool, { InnerLink } from '~~/lib/interfaces/ITool';

export default {
  props: {
    links: {
      type: Array<InnerLink>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false,
    },
    tool: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  methods: {
    async removeLink(index: number) {
      await api.auth_delete(`/tools/links/${this.links[index].id}`, { tool_id: this.tool.id });
      this.links.splice(index, 1);
    }
  }
}
</script>