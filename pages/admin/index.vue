<template>
  <!-- On the smallest devices, we use a list and left/right arrows to navigate the tabs.-->
  <div class="bg-secondary pa-1 hidden-md-and-up flex-shrink-1 tab-selector">
    <v-btn variant="flat" icon color="secondary" @click="previousTab" v-if="tab !== items[0].name" class="btn-top prev">
      <v-icon size="x-large">mdi-chevron-left</v-icon>
    </v-btn>
    <div>{{ tab }}</div>
    <v-btn flat icon color="secondary" @click="nextTab" v-if="tab !== items[items.length - 1].name" class="btn-top next">
      <v-icon size="x-large">mdi-chevron-right</v-icon>
    </v-btn>
  </div>

  <!-- For intermediate displays, we use a classic tabs system, centered on the view-->
  <v-tabs class="hidden-lg-and-up hidden-sm-and-down" bg-color="secondary" v-model="tab" align-tabs="center">
    <v-tab v-for="item in listItems" :value="item">{{ item }}</v-tab>
  </v-tabs>

  <!-- On the biggest definitions, we use the left side bar to display icons with an extendable panel on hover.-->
  <v-navigation-drawer expand-on-hover rail color="secondary">
    <v-list density="compact" nav>
      <v-list-item v-for="item in items" :prepend-icon="item.icon" :value="item.name" @click="() => (tab = item.name)">
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!--  -->
  <v-window v-model="tab" :class="{'flex-grow-1': true, 'size-bound': sizeBound, 'overflow-y-scroll': true}">
    <v-window-item v-for="tab in items" :value="tab.name" class="pa-2 overflow-y-auto">
      <component :is="tab.component" />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import { findIndex } from 'lodash';
import { resolveComponent } from 'vue';
import { useDisplay } from 'vuetify';

export default {
  data: () => ({
    tab: 'parameters',
    items: [
      {name: 'parameters', icon: 'mdi-music-circle', component: resolveComponent('admin-parameters')},
      {name: "generators", icon: "mdi-factory", component: resolveComponent('admin-generators')},
      {name: 'categories', icon: 'mdi-folder-outline', component: resolveComponent('admin-categories')},
      {name: 'applications', icon: 'mdi-lock-outline', component: resolveComponent('admin-applications')},
      {name: 'groups', icon: 'mdi-account-group', component: resolveComponent('admin-groups')},
      {name: 'rights', icon: 'mdi-account-group', component: resolveComponent('admin-rights')},
    ]
  }),
  computed: {
    listItems(): String[] {
      return this.items.map(i => i.name)
    },
    idx() {
      return findIndex(this.items, i => i.name === this.tab);
    },
    sizeBound() {
      return useDisplay().smAndDown.value;
    },
  },
  methods: {
    nextTab() {
      this.tab = this.items[this.idx + 1].name
    },
    previousTab() {
      this.tab = this.items[this.idx + -1].name
    },
  }
};
</script>

<style scoped lang="scss">
.tab-selector {
  height: 48px;
  position: relative;
  text-align: center;
  line-height: 40px;
}

.size-bound {
  height: calc(100vh - 112px);
}

.btn-top {
  position: absolute;
  top: 0px;
  &.next {
    right: 0px;
  }
  &.prev {
    left: 0px;
  }
}
</style>