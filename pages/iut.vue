<template>
  <div class="wrapper mt-5">
    <v-row>
      <v-col cols="2">
        <v-select :items="['find', 'distinct']" v-model="action" label="Action" variant="outlined" @update:modelValue="results = []" />
      </v-col>
      <v-col cols="8">
        <v-text-field v-if="action === 'distinct'" variant="outlined" label="Field" v-model="field" />
        <HighCode
          v-if="action === 'find'"
          class="code"
          :codeValue="query"
          width="100%"
          height="500px"
          lang="json"
          theme="light"
          :textEditor="true"
          @getCodeValue="saveCode"
          ref="highlighter"
        ></HighCode>
      </v-col>
      <v-col cols="2">
        <v-btn @click="makeQuery()" color="primary" size="x-large">Valider</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="results.length" class="mt-5">
      <v-table v-if="action === 'find'">
        <thead>
          <tr>
            <th>type</th>
            <th>titre</th>
            <th>pages</th>
            <th>année</th>
            <th>auteurs</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in results">
            <td>{{ line.type }}</td>
            <td>{{ line.title }}</td>
            <td>
              <span class="no-break" v-if="line.pages">{{ line.pages.start }} - {{  line.pages.end }}</span>
            </td>
            <td>{{ line.year }}</td>
            <td>{{ line.authors.join(', ') }}</td>
          </tr>
        </tbody>
      </v-table>
      <v-list v-if="action === 'distinct'" :items="results" />
    </v-row>
    <v-row class="mt-5 mb-5">
      <v-btn color="secondary" v-if="page > 0" @click="page -= 1; makeQuery()">Page précédente</v-btn>
      <v-btn class="ml-2" color="secondary" v-if="results.length >= 50" @click="page += 1; makeQuery()">Page suivante</v-btn>
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "empty",
});
</script>

<script lang="ts">
import axios from 'axios';
import { HighCode } from 'vue-highlight-code';
import 'vue-highlight-code/dist/style.css';

export default {
  components: { HighCode },
  data() {
    return {
      action: 'find',
      query: '{}',
      field: 'name',
      results: [] as any[],
      page: 0
    }
  },
  methods: {
    async makeQuery() {
      this.results = [];
      const { action, query, field, page } = this;
      this.results = (await axios.post('/proxy/iut', { action, query, field, page })).data;
    },
    saveCode(_event: PointerEvent) {
      const highlighter = this.$refs.highlighter as any;
      this.query = highlighter.modelValue;
    },
  }
}
</script>

<style scoped>
.wrapper {
  width: 1280px;
  min-height: 100vh;
  margin: 0 auto;
}
.no-break {
  white-space: nowrap;
}
</style>