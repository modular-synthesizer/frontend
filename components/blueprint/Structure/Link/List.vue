<template>
  <template v-for="link in blueprint.links">
    <blueprint-structure-link
      v-if="link.id !== selection.item?.id"
      :link="link"
      :blueprint="blueprint"
      @selected="selection.select(link)"
    />
  </template>
  <blueprint-structure-link
    v-if="selection.item"
    :link="selection.item"
    :blueprint="blueprint"
    :selected="true"
    @deselected="selection.reset()"
  />
</template>

<script lang="ts" setup>
import type { Blueprint } from '~~/types/blueprints/Blueprint';

const { blueprint } = defineProps({
  blueprint: { type: Object as PropType<Blueprint>, required: true }
});

const selection = ref(useSelectables().state.value.links);
</script>