<template>
  <blueprint-creator v-model="blueprint" />
</template>

<script lang="ts" setup>
import type { Blueprint } from '~/types/blueprints/Blueprint';
import { repositories } from '~~/lib/repositories';

definePageMeta({ layout: false });

const blueprint: Blueprint = await repositories.blueprints.get(useRoute().params.id as string);
</script>