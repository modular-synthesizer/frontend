<template>
  <slot name="loader" v-if="state === 'pending'">
    <div class="d-flex justify-center">
      <VProgressCircular indeterminate />
    </div>
  </slot>
  <slot name="success" :props="{ content }" v-if="state === 'success'"></slot>
  <slot name="error" :props="{ error: content }" v-if="state === 'failure'"></slot>
</template>

<script setup lang="ts">
const { url } = defineProps({
  url: { type: String, required: true }
});

type LoadState = 'pending'|'success'|'failure';

const content = ref();
const state: Ref<LoadState> = ref('pending');

api_get(`/proxy/${url}`)
  .catch((exception: any) => {
    state.value = 'failure';
    content.value = exception
  })
  .then((results: any) => {
    state.value = 'success';
    content.value = results;
  })

</script>