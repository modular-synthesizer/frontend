<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col sm="10" md="8" lg="6" offset-sm="1" offset-md="2" offset-lg="3">
        <v-tabs v-model="tab" bkacground-color="primary">
          <v-tab value="categories">{{ $t('admin.tabs.categories') }}</v-tab>
          <v-tab value="parameters">{{ $t('admin.tabs.parameters') }}</v-tab>
          <v-tab value="tools">{{ $t('admin.tabs.tools') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="categories">
            <Categories />
          </v-window-item>
          <v-window-item value="parameters">
            <Parameters />
          </v-window-item>
          <v-window-item value="tools">
            <Tools />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import Categories from '~~/components/admin/categories.vue';
import Parameters from '../../components/admin/parameters.vue';
import Tools from '../../components/admin/tools.vue';

export default {
    data: () => ({
        tab: "categories"
    }),
    components: { Categories, Parameters, Tools },
    methods: {
      ...mapActions(useGenerators, ['fetchGenerators'])
    },
    mounted() {
      this.fetchGenerators();
    }
}
</script>