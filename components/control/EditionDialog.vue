<template>
  <v-dialog max-width="500" v-model="state.displayed">
    <v-card>
      <v-card-title>{{ state.creating ? 'creation' : 'edition' }}</v-card-title>
      <v-card-text>
        <div v-for="(_, name) in payload">
          <control-edition-field :control="state.control" :name="name" @updated="savePayload" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="state.creating" @click="save">
          {{ $t('common.create') }}
        </v-btn>
        <v-btn v-else @click="save">
          {{ $t('common.save') }}
        </v-btn>
        <v-btn @click="useControlEdition().reset">
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ControlEditionState } from '~~/composables/controls/useControlEdition';
import { IControl } from '~~/lib/interfaces/IControl';
import { ComponentNames, controlsPayloads } from '~~/lib/types/controls';

const state: Ref<ControlEditionState> = useControlEdition().state;

const payload = computed(() => {
  const component = state.value.control?.component;
  if (component === undefined) return;
  return controlsPayloads[component as ComponentNames];
});

const emit = defineEmits<{ save: [ IControl ]}>()

function savePayload(name: string, value: any) {
  debounce('save', 500, () => {
    if (state.value.control === undefined) return;
    state.value.control.payload[name] = value;
  });
}

function save() {
  if (state.value.control !== undefined) {
    emit("save", state.value.control);
  }
  state.value.displayed = false;
}
</script>

<style>

</style>