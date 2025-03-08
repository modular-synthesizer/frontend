<template>
  <slot name="loader" v-if="state === 'pending'">
    <div class="d-flex justify-center">
      <VProgressCircular indeterminate />
    </div>
  </slot>
  <slot name="success" :props="{ content, remove: removeItem }" v-if="state === 'success'"></slot>
  <slot name="error" :props="{ error: content }" v-if="state === 'failure'"></slot>
</template>

<script setup lang="ts">
import { remove } from 'lodash';
import { Repository } from '~/lib/repositories/utils/Repository';
import type { Identified } from '~/types/utils/Identified';

const { repository } = defineProps({
  repository: { type: Object as PropType<Omit<Repository<any>, "add">>, required: true }
});

type LoadState = 'pending'|'success'|'failure';

const content: Ref<Array<Identified>> = ref([]);
const state: Ref<LoadState> = ref('pending');

repository.list()
  .catch((exception: any) => {
    state.value = 'failure';
    content.value = exception
  })
  .then((results: any) => {
    state.value = 'success';
    content.value = results;
  });

function removeItem(item: Identified) {
  remove(content.value, { id: item.id });
  repository.delete(item.id);
}
</script>