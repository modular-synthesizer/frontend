<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h2">Mes outils</div>
      </v-col>
      <v-col cols="12">
        <v-btn to="/tools/new">Nouveau</v-btn>
        <v-btn class="ml-2" @click="triggerImport">Importer</v-btn>
        <input type="file" v-show="false" ref="filePicker" @change="updatePicker" />
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Nom</th>
              <th>Largeur</th>
              <th>Noeuds</th>
              <th>Liens</th>
              <th>Ports</th>
              <th>Paramètres</th>
              <th>Contrôles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tool in tools">
              <td>{{ tool.id }}</td>
              <td>{{ tool.name }}</td>
              <td>{{ tool.slots }}</td>
              <td>{{ tool.nodes.length }}</td>
              <td>{{ tool.links.length }}</td>
              <td>{{ tool.ports.length }}</td>
              <td>{{ tool.parameters.length }}</td>
              <td>{{ tool.controls.length }}</td>
              <td>
                <v-btn icon variant="plain" size="small" @click="deleteTool(tool)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn @click="exportTool(tool)" icon variant="plain" size="small">
                  <v-icon>mdi-export</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import ITool from '~~/lib/interfaces/ITool';

export default {
  computed: {
    ...mapState(useToolsList, ['tools'])
  },
  mounted() {
    useToolsList().fetchTools();
  },
  methods: {
    exportTool(tool: ITool) {
      const blob = new Blob([JSON.stringify(tool)], {type: 'application/json'})
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${tool.name}.json`
      link.click();
      URL.revokeObjectURL(link.href);
    },
    triggerImport() {
      (this.$refs.filePicker as any).click();
    },
    updatePicker($event: Event) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = JSON.stringify(event.target?.result);
        localStorage.setItem("import-json", content);
        this.$router.push("/tools/new");
      }
      reader.readAsText(($event.target as any).files[0]);
    },
    deleteTool(tool: ITool) {
      api.auth_delete(`/tools/${tool.id}`).then(() => {
        useToolsList().fetchTools();
      })
    }
  }
}
</script>