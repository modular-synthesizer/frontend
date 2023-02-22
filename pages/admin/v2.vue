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
      <v-window v-model="tab">
        <v-window-item value="groups">
          <div class="text-center">
            [IN DEVELOPMENT]
          </div>
        </v-window-item>
        <v-window-item value="categories">
          <Categories />
        </v-window-item>
        <v-window-item value="parameters">
          <Parameters />
        </v-window-item>
        <v-window-item value="applications">
          <Applications />
        </v-window-item>
      </v-window>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Categories from '~~/components/admin/categories.vue';
import Parameters from '~~/components/admin/parameters.vue';
import Applications from '~~/components/admin/applications.vue';

export default {
  components: { Applications, Categories, Parameters },
  data: () => ({
    tab: 'groups',
    items: [
      {name: 'groups', icon: 'mdi-account-group'},
      {name: 'categories', icon: 'mdi-folder-outline'},
      {name: 'parameters', icon: 'mdi-music-circle'},
      {name: 'applications', icon: 'mdi-lock-outline'}
    ]
  }),
  methods: {
    display(name: string) {
      this.tab = name;
    }
  }
}
</script>