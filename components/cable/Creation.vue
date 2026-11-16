<template>
  <template v-if="start && end"><cable-view :start="start" :end="end" :no-events="true" color="red" /></template>
</template>

<script setup lang="ts">
import type { Port } from '~/features/cables/core/data/Port.type';
import { portPosition, type CablesAdapter } from '~/features/cables/shell/legacy/cables.adapter';
import { CABLES } from '~/features/synthesizers/shared/Constants';
import type { Coordinates } from '~/types/utils/Coordinates';

const cablesAdapter: CablesAdapter = inject(CABLES) as CablesAdapter

type DragCallback = (callback: ($event: MouseEvent) => void) => void

const dropped: DragCallback = inject('dropped') as DragCallback;

dropped(() => cablesAdapter.drop())

const positionOf = (port: Port): Coordinates | undefined => {
  const legacy = cablesAdapter.portOf(port)
  return legacy ? portPosition(legacy) : undefined
}

const start = computed(() => {
  const drag = cablesAdapter.drag()
  return drag.step === 'idle' ? undefined : positionOf(drag.origin)
})

const end = computed(() => {
  const drag = cablesAdapter.drag()
  switch (drag.step) {
    case 'started': return useCoordinates().absolute()
    case 'magnetized': return positionOf(drag.target)
    default: return undefined
  }
})
</script>