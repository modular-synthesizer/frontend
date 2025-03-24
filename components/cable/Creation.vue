<template>
  <cable :start="useLinkCreation().origin" :end="useLinkCreation().destination" :no-events="true" color="red" />
</template>

<script setup lang="ts">
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
  const { displayed, magnetized } = useLinkCreation();
  if (displayed && magnetized ) {
    const { startPort, endPort, cable } = useLinkCreation();
    emit('created', cable);
    useLinkCreation().resetCable();
    useLinkCreation().end();
    const results: LinkPayload = await repositories.links.create({ from: startPort.id, to: endPort.id, color: 'red', id: '' }, synthesizer);
    cable.id = results.id
  }
  else {
    useLinkCreation().end();
  }
})
</script>