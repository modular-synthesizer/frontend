<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <div class="text-h2">Mes outils</div>
        <v-btn to="/tools/new" class="mt-2">Nouveau</v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="8" offset="2">
        <list-loader :repository="repositories.tools">
          <template #success="{ props }">
            <tool-table>
              <tool-table-row v-for="tool in props.content" :tool="(tool as Tool)" @deleted="props.remove(tool)" />
            </tool-table>
          </template>
        </list-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import type { Tool } from '~/types/tools/Tool';
</script>