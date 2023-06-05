<template>
  <v-row class="mt-5">
    <v-col cols="4">
      <v-text-field v-model="tool.name" variant="outlined" label="Name" density="comfortable" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">
      <v-text-field v-model.number="tool.slots" variant="outlined" label="Slots" type="number" density="comfortable" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">
      <v-select :items="selectableCategories" variant="outlined" density="comfortable" label="Catégorie" v-model="tool.categoryId" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-checkbox label="Experimental" v-model="tool.experimental" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { PropType } from 'vue';
import ICategory from '~~/lib/interfaces/ICategory';
import ITool from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
        required: true
    }
  },
  computed: {
    tool() { return this.modelValue },
    ...mapState(useCategories, ['categories']),
    selectableCategories() {
      return this.categories.map((category: ICategory) => {
        return {title: category.name, value: category.id}
      })
    }
  },
  mounted() {
    useCategories().fetchCategories();
  }
}
</script>