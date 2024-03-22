<template>
    <slot v-if="items.length > 0" :items="items"></slot>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';

const { url } = defineProps<{ url: string }>();
const items: any[] = await api.auth_get(url);
</script>