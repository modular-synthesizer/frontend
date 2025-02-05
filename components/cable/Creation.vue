<template>
  <cable :start="useLinkCreation().origin" :end="useLinkCreation().destination" :no-events="true" color="red" />
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import type { DragCallback } from '~/types/draggables/DragDeclaration';
import type { Cable, LinkPayload, Synthesizer } from '~/types/Index';

const { dropped, synthesizer } = defineProps({
  dropped: { type: Function as DragCallback, required: true },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

type Emits = { created: [ Cable ] };

const emit = defineEmits<Emits>();

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