<template>
  <v-form class="mt-5">
    <v-row>
      <v-col cols="3">
        <v-select
          variant="outlined"
          v-model="parameter.descriptorId"
          :items="descriptorsList"
          density="comfortable"
          label="Descripteur"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field variant="outlined" label="Nom" density="comfortable" v-model="parameter.name" />
      </v-col>
      <v-col cols="4">
        <v-combobox
          chips
          closable-chips
          v-model="parameter.targets"
          :multiple="true"
          label="Cibles"
          variant="outlined"
          :density="parameter.targets.length === 0 ? 'comfortable' : 'compact'"
        />
      </v-col>
      <v-col cols="2">
        <v-btn @click="addParameter" color="blue-grey-lighten-5" size="large">Ajouter</v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-row>
    <v-col cols="12">
      <v-table>
        <thead>
          <tr>
            <th>UUID</th>
            <th>Descripteur</th>
            <th>Nom</th>
            <th>Cibles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(parameter, idx) in parameters">
            <td>{{ parameter.id }}</td>
            <td><tools-constraints v-bind="parameter.constraints" /></td>
            <td>{{ parameter.name }}</td>
            <td>
              <v-chip closable v-for="target in parameter.targets" class="mr-1" size="small">
                {{ target }}
              </v-chip>
            </td>
            <td>
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removeParameter(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { cloneDeep, find } from 'lodash';
import { mapState } from 'pinia';
import { IToolParameter } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Array<IToolParameter>,
        default: () => []
    }
  },
  data: () => ({
    parameter: {
      id: "",
      name: "",
      descriptorId: "",
      targets: []
    }
  }),
  computed: {
    parameters() { return this.modelValue; },
    ...mapState(useDescriptors, {descriptors: 'parameters'}),
    descriptorsList() {
      return this.descriptors.map(d => ({title: d.name, value: d.id}))
    }
  },
  methods: {
    removeParameter(index: number) {
      this.parameters.splice(index, 1);
    },
    addParameter() {
      const constraints = find(this.descriptors, {id: this.parameter.descriptorId})?.constraints
      if (constraints !== undefined) {
        this.parameters.push({...cloneDeep(this.parameter), constraints});
        this.parameter = {id: "", name: "", targets: [], descriptorId: ""};
        this.resetDescriptor();
      }
    },
    resetDescriptor() {
      this.parameter.descriptorId = this.descriptors[0].id;
    }
  },
  mounted() {
    useDescriptors().fetchDescriptors().then(() => {
      this.resetDescriptor();
    })
  }
}
</script>