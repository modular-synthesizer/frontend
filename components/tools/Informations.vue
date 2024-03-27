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
      <data-fetcher url="/categories">
        <template v-slot="{ items: categories}">
          <v-select
            :items="categories"
            variant="outlined"
            density="comfortable"
            label="Catégorie"
            v-model="tool.categoryId"
            item-title="name"
            item-value="id"
          />
        </template>
      </data-fetcher>
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
  data() {
    return {
      selectableCategories: [] as any[],
    };
  },
  computed: {
    tool() { return this.modelValue }
  }
}
</script>