<template>
  <v-col cols="12">
    <v-form ref="controls-form" class="mt-5">
      <v-row no-gutters>
        <v-col cols="2">
          <v-select
          v-model="modelValue.component"
          density="comfortable"
          label="composant"
          variant="outlined"
          :items="components"
        />
        </v-col>
        <v-col cols="8" class="flex-shrink-1 pl-2 pr-3">
          <v-combobox
            v-model="chips"
            chips
            :multiple="true"
            @update:model-value="updateChips"
            closable-chips
            :density="chips.length === 0 ? 'comfortable' : 'compact'"
            variant="outlined"
            label="payload"
            hint="Entrez les couples clefs/valeur sous la forme k=v et appuyez sur Entrée"
          />
        </v-col>
        <v-col cols="2" class="flex-grow-1 pr-2">
          <v-btn color="green-lighten-3" size="small" @click="validate" icon>
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-btn color="blue-grey-lighten-4" class="ml-2" size="small" @click="reset" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script setup lang="ts">
import { flatten } from 'lodash';
import { PropType } from 'vue';
import { IControl } from '~~/lib/interfaces/IControl';
import { useControls } from '~~/composables/components/useControls';

const components: string[] = await useControls().fetch();

const props = defineProps({
  modelValue: { type: Object as PropType<IControl>, required: true },
  index: { type: Number, default: -1 },
});

type EmitDefinition = {
  created: [ control: IControl ],
  updated: [ control: IControl ],
  reset: [  ],
};
const emit = defineEmits<EmitDefinition>();

const chips = computed(() => {
  return Object.entries(props.modelValue.payload).map((entry: [string, any]) => {
    return `${entry[0]}=${entry[1]}`
  });
});

function updateChips(values: string[]) {
  const filtered: string[] = values.filter((v: string) => /^[a-zA-z]+\=.+$/.test(v));
  const mapped = flatten(filtered.map((v: string) => v.split(" ")))

  const parsedValues = mapped.map(v => {
    const splitted = v.split("=");
    const value = /^[0-9]+$/.test(splitted[1]) ? Number(splitted[1]) : splitted[1];
    return [splitted[0], value]
  })
  props.modelValue.payload = Object.fromEntries(parsedValues);
}

function validate() {
  props.modelValue.id ? emit('created', props.modelValue) : emit("updated", props.modelValue);
}

function reset() {
  emit("reset");
}
</script>