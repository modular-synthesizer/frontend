<template>
  <v-row class="mt-5" v-if=blueprint>
    <v-col cols="4">
      <v-text-field v-model="blueprint.name" variant="outlined" label="Name" density="comfortable" :rules="rules.name" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">
      <v-text-field v-model.number="blueprint.slots" variant="outlined" label="Slots" type="number" density="comfortable" />
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
          v-model="blueprint.category.id"
          item-title="name"
          item-value="id"
        />
      </template>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-checkbox label="Experimental" v-model="blueprint.experimental" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import { repositories } from '~~/lib/repositories';
import type { Category } from '~/types/blueprints/Category';


type Rules = {[key: string]: Function[]}

const props = defineProps({
  modelValue: { type: Object as PropType<Blueprint>, required: true },
    rules: { type: Object as PropType<Rules>, default: () =>({})}
});

const blueprint = computed(() => props.modelValue);

const categories: Ref<Category[]> = ref(await repositories.categories.list());
</script>