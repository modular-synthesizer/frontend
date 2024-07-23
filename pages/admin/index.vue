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
            <v-window-item value="rights">
              <AdminRights />
            </v-window-item>
            <v-window-item value="categories">
              <Categories />
            </v-window-item>
            <v-window-item value="applications">
              <Applications />
            </v-window-item>
            <v-window-item value="generators">
              <Generators />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Categories from '~~/components/admin/categories.vue';
import Applications from '~~/components/admin/applications.vue';
import AdminRights from '~~/components/admin/rights.vue';
import Generators from "~~/components/admin/generators.vue"

export default {
  components: { Applications, Categories, Generators, AdminRights },
  data: () => ({
    tab: 'groups',
    items: [
      {name: 'rights', icon: 'mdi-account-group'},
      {name: 'categories', icon: 'mdi-folder-outline'},
      {name: 'applications', icon: 'mdi-lock-outline'},
      {name: "generators", icon: "mdi-factory"},
    ]
  }),
  methods: {
    display(name: string) {
      this.tab = name;
    }
  }
}
</script>