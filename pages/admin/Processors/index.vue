<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <v-table density="compact">
          <thead>
            <tr>
              <th>UUID</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="processor in processors">
              <td>{{ processor.id }}</td>
              <td>{{ processor.url }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { api } from '~~/lib/api/Api';

const processors = await api.auth_get('/processors');
</script>