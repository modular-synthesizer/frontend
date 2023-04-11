<template>
  <v-container>
    <v-navigation-drawer expand-on-hover rail color="secondary">
      <v-list density="compact" nav>
        <v-list-item v-for="item in items" :prepend-icon="item.icon" :value="item.name" @click="display(item.name)">
          {{ item.name }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-container>
      <v-row>
        <v-col cols="8" offset="2">
          <v-window v-model="tab">
            <v-window-item v-for="tab in items" :value="tab.name">
              <component :is="tab.component" />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Categories from '~~/components/admin/categories.vue';
import Parameters from '~~/components/admin/parameters.vue';
import Applications from '~~/components/admin/applications.vue';
import AdminRights from '~~/components/admin/rights.vue';
import Generators from "~~/components/admin/generators.vue"
import { resolveComponent } from 'vue';

export default {
  components: { Applications, Categories, Generators, Parameters, AdminRights },
  data: () => ({
    tab: 'groups',
    items: [
      {name: 'groups', icon: 'mdi-account-group', component: resolveComponent('admin-groups')},
      {name: 'rights', icon: 'mdi-account-group', component: resolveComponent('admin-rights')},
      {name: 'categories', icon: 'mdi-folder-outline', component: resolveComponent('admin-categories')},
      {name: 'parameters', icon: 'mdi-music-circle', component: resolveComponent('admin-parameters')},
      {name: 'applications', icon: 'mdi-lock-outline', component: resolveComponent('admin-applications')},
      {name: "generators", icon: "mdi-factory", component: resolveComponent('admin-generators')},
    ]
  }),
  methods: {
    display(name: string) {
      this.tab = name;
    }
  }
}
</script>