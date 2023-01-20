<template>
  <v-container>
    <v-row>
      <div class="text-h2 mt-2">Générateurs de noeuds</div>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="3">
        <v-alert type="info" variant="outlined" class="mb-3">
          Un générateur crée les noeuds de la Web Audio API utilisés par les modules.<br />
          Il prend deux paramètres :
          <ul>
            <li><code>name</code> représentant le nom du noeud généré</li>
            <li><code>context</code> représentant l'AudioContext</li>
          </ul>
          Il retourne un tableau d'objets contenant les champs :
          <ul>
            <li><code>name</code> Le nom du noeud généré</li>
            <li><code>node</code> Le noeud créé par le générateur</li>
          </ul>
        </v-alert>
        <v-text-field variant="outlined" density="comfortable" v-model="generator.name" label="Nom" />
        <v-textarea v-model="generator.code" variant="outlined" rows="10" label="Entrez le code du générateur" />
        <v-btn color="blue-grey-lighten-5" @click="createGenerator">Valider</v-btn>
      </v-col>
      <v-col cols="9">
        <v-table>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Nom</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="generator in generators">
              <td>{{ generator.id }}</td>
              <td>{{ generator.name }}</td>
              <td><code>{{ generator.code }}</code></td>
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
import { IGenerator } from '~~/lib/interfaces/IGenerator';

export default {
  data: () => ({
    generator: { name: "", code: "" } as IGenerator,
  }),
  computed: {
    ...mapState(useGenerators, ['generators'])
  },
  mounted() {
    useGenerators().fetchGenerators();
  },
  methods: {
    createGenerator() {
      api.auth_post('/generators', this.generator).then(() => {
        useGenerators().fetchGenerators();
      })
    }
  }
}
</script>