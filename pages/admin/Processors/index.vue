<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <v-btn to="/admin/processors/new">Créer nouveau</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" offset="3">
        <v-table density="compact">
          <thead>
            <tr>
              <th>UUID</th>
              <th>Name</th>
              <th>Class name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="processor in processors">
              <td>{{ processor.id }}</td>
              <td>{{ processor.registration_name }}</td>
              <td>{{ processor.registration_name }}</td>
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