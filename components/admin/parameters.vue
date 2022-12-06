<template>
  <v-container>
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
              <th>Default</th>
              <th>Constraints</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="parameter in parameters">
              <td>{{ parameter.id }}</td>
              <td>{{ parameter.name }}</td>
              <td>{{ parameter.value }}</td>
              <td><constraints :constraints="parameter.constraints" /></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
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
    }
  }),
  computed: {
    ...mapState(useDescriptors, ['parameters']),
    ...mapState(useAuthentication, ["session"])
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