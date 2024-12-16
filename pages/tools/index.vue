<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <div class="text-h2">Mes outils</div>
        <v-btn to="/tools/new" class="mt-2">Nouveau</v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="10" offset="1">
        <template v-if="tools">
          <v-table>
            <thead>
              <tr>
                <th>UUID</th>
                <th>&nbsp;</th>
                <th>Nom</th>
                <th>Largeur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tools" v-for="tool in tools">
                <td>{{ tool.id }}</td>
                <td><v-icon v-if=tool.experimental color="red">mdi-alert</v-icon></td>
                <td>{{ tool.name }}</td>
                <td>{{ tool.slots }}</td>
                <td>
                  <deletion-dialog
                    :url="`/tools/${tool.id}`"
                    size="small"
                    icon
                    @confirmed="remove(tool.id)"
                    :text="`l'outil '${tool.name}'`"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </deletion-dialog>
                  <v-btn :to="`/tools/${tool.id}`" icon variant="plain" size="small">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';
import { repositories } from '~~/lib/repositories';

const tools: Ref<Tool[]> = ref(await repositories.tools.list());
const remove = repositories.tools.remove(tools.value);
</script>