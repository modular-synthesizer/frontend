<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h2">Mes outils</div>
      </v-col>
      <v-col cols="12">
        <v-btn to="/tools/new">Nouveau</v-btn>
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
                <v-btn :to="`/tools/${tool.id}`" icon="mdi-pencil" variant="plain" size="small" />
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

export default {
  computed: {
    ...mapState(useToolsList, ['tools'])
  },
  mounted() {
    useToolsList().fetchTools();
  }
}
</script>