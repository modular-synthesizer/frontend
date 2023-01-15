<template>
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
import { IToolParameter } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Array<IToolParameter>,
        default: () => []
    }
  },
  computed: {
    parameters() { return this.modelValue; }
  },
  methods: {
    removeParameter(index: number) {
      this.parameters.splice(index, 1);
    }
  }
}
</script>