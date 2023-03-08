<template>
  <v-col cols="12">
    <v-form ref="controls-form" class="mt-5">
      <v-row no-gutters>
        <v-col cols="2">
          <v-select
          v-model="control.component"
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
            @update:model-value="setPayloadValue"
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

<script lang="ts">
import { cloneDeep, flatten } from 'lodash';
import { PropType } from 'vue';
import { IControl } from '~~/lib/interfaces/IControl';

export default {
  props: {
    modelValue: {
      type: Object as PropType<IControl>,
      default: () => []
    },
    index: {
      type: Number,
      default: () => -1,
    }
  },
  data: () => ({
    components: [
      'SmallKnob', 'LargeKnob', 'Knob', 'Port', 'MidiController'
    ],
  }),
  computed: {
    control() { return this.modelValue; },
    chips() {
      return Object.entries(this.control.payload).map((entry: [string, any]) => {
        return `${entry[0]}=${entry[1]}`
      })
    }
  },
  methods: {
    setPayloadValue(value: any) {
      this.updateChips(value);
    },
    updateChips(values: string[]) {
      const filtered: string[] = values.filter((v: string) => /^[a-zA-z]+\=.+$/.test(v));
      const mapped = flatten(filtered.map((v: string) => v.split(" ")))

      const parsedValues = mapped.map(v => {
        const splitted = v.split("=");
        const value = /^[0-9]+$/.test(splitted[1]) ? Number(splitted[1]) : splitted[1];
        return [splitted[0], value]
      })
      this.control.payload = Object.fromEntries(parsedValues);
    },
    validate() {
      const result: IControl = cloneDeep(this.control);
      if (this.index < 0) {
        this.$emit("created", result);
      }
      else {
        this.$emit("updated", result);
      }
      this.reset();
    },
    reset() {
      this.$emit("reset");
      this.chips = [];
    }
  }
}
</script>