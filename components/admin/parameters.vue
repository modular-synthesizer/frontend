<template>
  <parameter-creator @created="add" :parameter="parameter" />
  <div class="hidden-sm-and-up pt-1">
    <v-card class="mx-auto mb-4" elevation="3" width="100%" v-for="param in parameters">
      <template v-slot:title>{{ param.name }}</template>
      <template v-slot:subtitle>{{ param.id }}</template>
      <v-card-text>
        <constraints :constraints="parameter.constraints" /><br />
        valeur par défaut : {{ param.value }}
      </v-card-text>
    </v-card>
  </div>
  <!--v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <parameter-creator @created="add" :parameter="parameter" />
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>{{ $t('common.uuid') }}</th>
              <th>{{ $t('common.name') }}</th>
              <th>Champ ciblé</th>
              <th>Default</th>
              <th>Constraints</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="parameter in parameters">
              <td>{{ parameter.id }}</td>
              <td>{{ parameter.name }}</td>
              <td>{{ parameter.field }}</td>
              <td>{{ parameter.value }}</td>
              <td><constraints :constraints="parameter.constraints" /></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container-->
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import IParameter from '~~/lib/interfaces/IParameter';
import Constraints from './constraints.vue';
import ParameterCreator from './dialogs/ParameterCreator.vue';

export default {
  data: () => ({
    creationDialog: false,
    parameter: {
      id: "",
      name: "",
      value: 1,
      constraints: {
        minimum: 0, maximum: 10, step: 1, precision: 0
      }
    } as IParameter,
  }),
  computed: {
    ...mapState(useDescriptors, ['parameters']),
    ...mapState(useAuthentication, ["session"]),
    displayedParameters() {
      return this.parameters.map((p: IParameter) => {
        const c = p.constraints;
        return {...p, constraints: `[${c.minimum},${c.maximum}] +/- ${c.step} p${c.step}`}
      });
    }
  },
  mounted() {
    this.fetchDescriptors();
  },
  methods: {
    ...mapActions(useDescriptors, ['fetchDescriptors']),
    add(parameter: IParameter) {
      const payload = {
        auth_token: this.session.token,
        name: parameter.name,
        field: parameter.field,
        default: parameter.value,
        ...parameter.constraints
      }
      api.post("/parameters", payload)
        .then((response: IParameter) => this.parameters.push(response))
    }
  },
  components: { Constraints, ParameterCreator }
}
</script>