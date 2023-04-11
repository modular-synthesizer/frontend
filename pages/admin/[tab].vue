<template>
  <h1 class="hidden-xs">test</h1>
  <v-navigation-drawer expand-on-hover rail color="secondary">
    <v-list density="compact" nav>
      <v-list-item v-for="item in items" :prepend-icon="item.icon" :value="item.name" @click="() => (tab = item.name)">
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-row no-gutter>
    <v-col sm="10" cols="12" offset-sm="1" offset="0" md="8" offset-md="2">
      <v-window v-model="tab">
        <v-window-item v-for="tab in items" :value="tab.name">
          <component :is="tab.component" />
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { resolveComponent } from 'vue';

export default {
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
};
</script>