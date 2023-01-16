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
        <v-btn @click="addParameter" color="blue-grey-lighten-5" size="large">Valider</v-btn>
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
              <v-btn icon="mdi-pencil" variant="plain" size="small" @click="startEditing(parameter)" />
              <v-btn icon="mdi-delete" variant="plain" size="small" @click="removeParameter(idx)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { cloneDeep, find, findIndex } from 'lodash';
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
      targets: [] as string[]
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
        const results: IToolParameter = {...cloneDeep(this.parameter), constraints}
        if (this.parameter.id === "") {
          this.parameters.push(results);
        }
        else {
          const index: number = findIndex(this.parameters, {id: this.parameter.id});
          if (index > -1) this.parameters[index] = results;
        }
        this.parameter = {id: "", name: "", targets: [], descriptorId: ""};
        this.resetDescriptor();
      }
    },
    resetDescriptor() {
      this.parameter.descriptorId = this.descriptors[0].id;
    },
    startEditing(parameter: IToolParameter) {
      this.parameter = {
        id: parameter.id,
        name: parameter.name,
        descriptorId: parameter.descriptorId as string,
        targets: parameter.targets,
      };
    }
  },
  mounted() {
    useDescriptors().fetchDescriptors().then(() => {
      this.resetDescriptor();
    })
  }
}
</script>