<template>
  <tool-creator :tool="tool" />
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
import { useCategories } from '~~/lib/stores/categories';
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
    ...mapState(useToolsList, ['tools'])
  },
  methods: {
    ...mapActions(useToolsList, ['fetchTools'])
  },
  mounted() {
    this.fetchTools();
  },
  components: {
    ToolCreator
  }
}
</script>