<template>
  <tool-creator :tool="tool" :creation-mode="false" />
</template>

<script lang="ts" setup>
import ITool from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';

definePageMeta({ layout: 'empty' });

const tool: ITool = await repositories.tools.get(useRoute().params.id as string);
</script>