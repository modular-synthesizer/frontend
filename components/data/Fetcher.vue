<template>
    <slot v-if="state === FetcherState.FETCHED" :items="items" :remove="remove" :add="add"></slot>
    <slot v-if="state === FetcherState.LOADING" name="loading">
        <v-skeleton-loader :type="loader" v-if="loader" />
    </slot>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';

enum FetcherState {
    LOADING,
    FETCHED,
    IDLE,
    ERROR
}

const { url, loader } = defineProps<{ url: string, loader?: string }>();
const items = ref();
const state: Ref<FetcherState> = ref(FetcherState.IDLE);


state.value = FetcherState.LOADING
api.auth_get(url).then(results => {
    items.value = results;
    state.value = FetcherState.FETCHED;
})

async function remove(id: string): Promise<void> {
    await api.auth_delete(`${url}/${id}`);
    items.value = items.value.filter((i: any) => i.id !== id);
}

async function add(infos: any) {
    items.value.push(await api.auth_post(url, infos));
}
</script>