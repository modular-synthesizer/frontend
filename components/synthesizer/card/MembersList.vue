<template>
<div class="text-h6">{{ $t('memberships.existing') }}</div>
<v-list>
  <template v-for="member in synthesizer.members">
    <v-list-item
      :title="member.username"
      :subtitle="member.type"
    >
      <template v-slot:append v-if="member.type !== 'creator'">
        <v-list-item-action>
          <v-btn icon variant="text" @click="emit('delete', member)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
  </template>
</v-list>
</template>

<script setup lang="ts">
import type { Membership } from '~/types/synthesizers/Membership';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

const { synthesizer } = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true }
});

const emit = defineEmits<{delete: [ membership: Membership ]}>();
</script>