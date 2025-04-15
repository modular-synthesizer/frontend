<template>
  <tool-creator v-model="tool" />
</template>

<script lang="ts" setup>
import type { Tool } from '~/types/tools/Tool';
import { repositories } from '~~/lib/repositories';

definePageMeta({ layout: false });

const tool: Tool = await repositories.tools.get(useRoute().params.id as string);
</script>