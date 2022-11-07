<template>
  <tool-creator :tool="tool" v-if="categories.length > 0 && generators.length > 0" @created="add" />
  <v-table>
    <thead>
      <tr>
        <th>{{ $t('tools.headers.category') }}</th>
        <th>{{ $t('common.uuid') }}</th>
        <th>{{ $t('common.name') }}</th>
        <th>{{ $t('tools.headers.slots') }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(list, category) in tools">
        <tr v-for="tool in list">
          <td>{{ category }}</td>
          <td>{{ tool.id }}</td>
          <td>{{ tool.name }}</td>
          <td>{{ tool.slots }}</td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import ITool from '~~/lib/interfaces/ITool';
import { useAuthentication } from '~~/lib/stores/authentication';
import { useCategories } from '~~/lib/stores/categories';
import { useGenerators } from '~~/lib/stores/tools/generators';
import { useToolsList } from '~~/lib/stores/tools/list';
import ToolCreator from './dialogs/ToolCreator.vue'

export default {
  data: () => ({
    tool: {
      id: "",
      name: "",
      category_id: "",
      inner_nodes: [],
      inner_links: [],
      inputs: [],
      outputs: [],
      parameters: [],
      slots: 2,
    }
  }),
  computed: {
    ...mapState(useCategories, ['categories']),
    ...mapState(useToolsList, ['tools']),
    ...mapState(useGenerators, ['generators']),
    ...mapState(useAuthentication, ['session']),
  },
  methods: {
    ...mapActions(useToolsList, ['fetchTools']),
    add(tool: ITool) {
      api.post("/tools", {auth_token: this.session.token, ...tool})
        .then(response => this.tools.push(response));
    }
  },
  mounted() {
    this.fetchTools();
  },
  components: {
    ToolCreator
  }
}
</script>