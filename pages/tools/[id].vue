<template>
  <template v-if="tool !== null">
    <tools-creator v-model="tool" @update:model-value="save" />
  </template>
</template>

<script lang="ts">
import ITool from "~~/lib/interfaces/ITool";
import { pick } from 'lodash';
import { repositories } from "~~/lib/repositories";

const tool: Ref<ITool> = ref(await repositories.tools.get(useRoute().params.id as string));

function save() {
  const fields: string[] = ['id', 'name', 'slots', 'categoryId', 'experimental'];
  repositories.tools.update(pick(tool.value, fields) as ITool);
}
</script>
