<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <div class="text-h2">Mes outils</div>
        <v-btn to="/blueprints/new" class="mt-2">Nouveau</v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="8" offset="2">
        <list-loader :repository="repositories.blueprints">
          <template #success="{ props }">
            <blueprint-table>
              <blueprint-table-row v-for="blueprint in props.content" :blueprint="(blueprint as Blueprint)" @deleted="props.remove(blueprint)" />
            </blueprint-table>
          </template>
        </list-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import type { Blueprint } from '~/types/blueprints/Blueprint';
</script>