<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <div class="text-h5">Créer un processeur sonore</div>
        <form @submit.prevent="save">
          <v-text-field v-model="registration_name" variant="outlined" density="compact" class="mt-5" label="Nom du processeur audio" />
          <code class="atom_one_dark d-block mb-2">
            <span class="hljs-keyword">class</span>
            <span class="hljs-title">&nbsp;{{ className }}</span>
            <span class="hljs-keyword"> extends</span>
            <span class="hljs-title"> AudioWorkletProcessor</span>&nbsp{<br />
              
            <span class="hljs-keyword">&nbsp;&nbsp;public</span>
            <span class="hljs-title"> process</span>(inputs, outputs, parameters) {
          </code>
          <HighCode
            class="code"
            :codeValue="process_function"
            width="100%"
            height="300px"
            lang="javascript"
            theme="dark"
            :textEditor="true"
            ref="highlighter"
          ></HighCode>
          <code class="atom_one_dark d-block mt-2">
            <span class="hljs-keyword">&nbsp;&nbsp;&nbsp;&nbsp;return</span>
            <span class="hljs-literal">&nbsp;true</span>;<br />
            <span>&nbsp;&nbsp;}</span><br />
            <span>}</span>
          </code>
          <v-btn color="primary" class="mt-5" type="submit">Créer</v-btn>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { capitalize } from 'lodash';
import { HighCode } from 'vue-highlight-code';
import 'vue-highlight-code/dist/style.css';
import { api } from '~~/lib/api/Api';

const registration_name = ref("");
const process_function = ref("")
const className = computed(() => {
  return registration_name.value.split('-').map(capitalize).join('');
})
const highlighter = ref(null);
async function save() {
  await api.auth_post('/processors', {
    registration_name: registration_name.value,
    process_function: (highlighter.value as any).modelValue,
  });
  navigateTo('/admin/processors')
}
</script>