<template>
    <slot v-if="items.length > 0" :items="items" :remove="remove" :add="add"></slot>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';

const { url } = defineProps<{ url: string }>();
const items = ref(await api.auth_get(url));

async function remove(id: string): Promise<void> {
    await api.auth_delete(`${url}/${id}`);
    items.value = items.value.filter((i: any) => i.id !== id);
}

async function add(infos: any) {
    items.value.push(await api.auth_post(url, infos));
}
</script>