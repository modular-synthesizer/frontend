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
              <th>&nbsp;</th>
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
            <data-fetcher url="/tools">
              <template v-slot:default="{ items: tools }">
                <tr v-if="tools" v-for="tool in tools">
                  <td>{{ tool.id }}</td>
                  <td><v-icon v-if=tool.experimental color="red">mdi-alert</v-icon></td>
                  <td>{{ tool.name }}</td>
                  <td>{{ tool.slots }}</td>
                  <td>{{ tool.nodes.length }}</td>
                  <td>{{ tool.links.length }}</td>
                  <td>{{ tool.ports.length }}</td>
                  <td>{{ tool.parameters.length }}</td>
                  <td>{{ tool.controls.length }}</td>
                  <td>
                    <deletion-dialog
                      :url="`/tools/${tool.id}`"
                      size="small"
                      icon
                      @confirmed="deleteTool(tool.id)"
                      :text="`l'outil '${tool.name}'`"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </deletion-dialog>
                    <v-btn @click="exportTool(tool)" icon variant="plain" size="small">
                      <v-icon>mdi-export</v-icon>
                    </v-btn>
                    <v-btn :to="`/tools/${tool.id}`" icon variant="plain" size="small">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </data-fetcher>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import ITool from '~~/lib/interfaces/ITool';

export default {
  data() {
    return {
      tools: [] as ITool[],
    };
  },
  methods: {
    exportTool(tool: ITool) {
      const blob = new Blob([JSON.stringify(tool)], {type: 'application/json'})
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      // link.download = `${tool.name}.json`
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
    async deleteTool(id: string) {
      await api.auth_delete(`/tools/${id}`);
    }
  }
}
</script>