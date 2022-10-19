<template>
  <v-container class="limited-width">
    <v-tabs v-model="tab" bkacground-color="primary">
      <v-tab value="categories">Categories</v-tab>
      <v-tab value="tools">Tools</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="categories">
        <Categories />
      </v-window-item>
      <v-window-item value="tools">
        <Tools />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts">
import Categories from '~~/components/admin/categories.vue';
import Tools from '../../components/admin/tools.vue';
export default {
    data: () => ({
        tab: "categories"
    }),
    components: { Categories, Tools }
}
</script>

<style scoped>
.limited-width {
  width: 60%;
}
</style>