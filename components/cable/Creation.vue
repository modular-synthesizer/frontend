<template>
  <template v-if="start && end"><cable :start="start" :end="end" :no-events="true" color="red" /></template>
</template>

<script setup lang="ts">
import { useCableCreation } from '~/composables/links/useCableCreation.composable';
import { repositories } from '~/lib/repositories';
import type { Cable, LinkPayload, Synthesizer } from '~/types/Index';

type DragCallback = (callback: ($event: MouseEvent) => void) => void

const { synthesizer } = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

type Emits = { created: [ Cable ] };

const emit = defineEmits<Emits>();

const dropped: DragCallback = inject('dropped') as DragCallback;

dropped(async () => {
  const { displayed, magnetized, startPort, endPort, cable  } = useCableCreation();
  console.log(displayed, magnetized, startPort, endPort, cable)
  useCableCreation().end();
  if (displayed && magnetized && startPort && endPort && cable ) {
    emit('created', cable);
    repositories.links.create({ from: startPort.id, to: endPort.id, color: 'red', id: '' }, synthesizer).then(res => {
      cable.id = res.id
    })
  }
})

const start = computed(() => useCableCreation().origin)
const end = computed(() => useCableCreation().destination)
</script>