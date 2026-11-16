<template>
  <cable-view v-if="origin && destination" :color="cable.color" :start="origin" :end="destination" :show-cable="useLinksDisplay().displayed" />
</template>

<script setup lang="ts">
import { useLinksDisplay } from '~/composables/links/useLinksDisplay';
import type { Cable } from '~/features/cables/core/data/Cable.type';
import type { Port } from '~/features/cables/core/data/Port.type';
import { portPosition, type CablesAdapter } from '~/features/cables/shell/legacy/cables.adapter';
import { CABLES } from '~/features/synthesizers/shared/Constants';
import type { Coordinates } from '~/types/utils/Coordinates';

const props = defineProps<{ cable: Cable }>();

const adapter = inject(CABLES) as CablesAdapter

const positionOf = (port: Port): Coordinates | undefined => {
  const legacy = adapter.portOf(port)
  return legacy ? portPosition(legacy) : undefined
}

const origin = computed(() => positionOf(props.cable.origin))
const destination = computed(() => positionOf(props.cable.destination))
</script>