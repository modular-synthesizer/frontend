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
    async categories() {
      return await useLists().categories
    },
    tool() { return this.modelValue },
    async selectableCategories() {
      return (await this.categories).all().map((category: ICategory) => {
        return {title: category.name, value: category.id}
      })
    }
  }
}
</script>