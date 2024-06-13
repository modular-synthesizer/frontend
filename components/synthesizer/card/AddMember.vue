<template>
  <v-tooltip :text="tooltip" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon variant="text" @click="emit('add', `${account.id}`, account.username, role)">
        <v-icon>mdi-{{ icon }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import IAccount from '@/lib/interfaces/IAccount'

const { tooltip, role, account, icon } = defineProps({
  tooltip: { type: String, required: true },
  role: { type: String, default: 'read' },
  account: { type: Object as PropType<IAccount>, required: true },
  icon: { type: String, default: 'plus' }
});

const emit = defineEmits<{ add: [accountId: string, username: string, role: string]}>()
</script>