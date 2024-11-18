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
      <template v-if="categories">
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
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-checkbox label="Experimental" v-model="tool.experimental" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ICategory from '~~/lib/interfaces/ICategory';
import ITool from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';

const { modelValue: tool } = defineProps({
  modelValue: { type: Object as PropType<ITool>, required: true },
});

const categories: Ref<ICategory[]> = ref(await repositories.categories.list());
</script>