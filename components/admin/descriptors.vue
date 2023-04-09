<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <descriptor-creator @created="create" :descriptor="descriptor" />
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>{{ $t('common.uuid') }}</th>
              <th>{{ $t('common.name') }}</th>
              <th>{{ $t('descriptors.list.columns.default') }}</th>
              <th>{{ $t('descriptors.list.columns.constraints') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="descriptor in descriptors">
              <td>{{ descriptor.id }}</td>
              <td>{{ descriptor.name }}</td>
              <td>{{ descriptor.default }}</td>
              <td><constraints :constraints="descriptor" /></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import Constraints from './constraints.vue';
import DescriptorCreator from './dialogs/DescriptorCreator.vue';
import { factory } from "@/lib/factories/tools/DescriptorFactory"
import IDescriptor from '~~/lib/interfaces/tools/IDescriptor';

export default {
  name: "DescriptorsList",
  components: {
    Constraints,
    DescriptorCreator
  },
  data: () => ({
    descriptor: factory.empty() as IDescriptor
  }),
  computed: {
    ...mapState(useDescriptors, ['descriptors']),
  },
  mounted() {
    this.fetch();
  },
  methods: {
    ...mapActions(useDescriptors, ['create', 'fetch']),
  },
}
</script>