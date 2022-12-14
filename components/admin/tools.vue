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
import ICategory from '~~/lib/interfaces/ICategory';
import ITool from '~~/lib/interfaces/ITool';
import ToolCreator from './dialogs/ToolCreator.vue'

function emptyTool() {
  return {
    id: "",
    name: "",
    category_id: "",
    innerNodes: [],
    innerLinks: [],
    inputs: [],
    outputs: [],
    parameters: [],
    slots: 2,
  }
}

export default {
  data: () => ({
    tool: emptyTool(),
  }),
  computed: {
    ...mapState(useCategories, ['categories']),
    ...mapState(useToolsList, ['tools']),
    ...mapState(useGenerators, ['generators']),
    ...mapState(useAuthentication, ['session']),
  },
  methods: {
    ...mapActions(useToolsList, ['fetchTools', 'addTool']),
    add(category: ICategory, tool: ITool) {
      api.post("/tools", {auth_token: this.session.token, ...tool})
        .then(response => {
          this.addTool(category.id, response);
          this.tool = emptyTool();
        });
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