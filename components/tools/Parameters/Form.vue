<template>
  <v-row class="mt-5" no-gutters>
    <v-col cols="2" class="pl-2">
      <v-text-field variant="outlined" label="Nom" density="comfortable" v-model="parameter.name" />
    </v-col>
    <v-col cols="1" class="pl-2">
      <v-text-field type="number" variant="outlined" label="Min" density="comfortable" v-model="parameter.minimum" />
    </v-col>
    <v-col cols="1" class="pl-2">
      <v-text-field type="number" variant="outlined" label="Max" density="comfortable" v-model="parameter.maximum" />
    </v-col>
    <v-col cols="1" class="pl-2">
      <v-text-field type="number" variant="outlined" label="Value" density="comfortable" v-model="parameter.default" />
    </v-col>
    <v-col cols="1" class="pl-2">
      <v-text-field type="number" variant="outlined" label="Step" density="comfortable" v-model="parameter.step" />
    </v-col>
    <v-col cols="1" class="pl-2">
      <v-text-field type="number" variant="outlined" label="Precision" density="comfortable" v-model="parameter.precision" />
    </v-col>
    <v-col cols="3" class="pl-2">
      <v-combobox
        chips
        closable-chips
        v-model="parameter.targets"
        :multiple="true"
        label="Cibles"
        variant="outlined"
        :density="parameter.targets.length === 0 ? 'comfortable' : 'compact'"
      />
    </v-col>
    <v-col cols="2" class="pl-2">
        <v-btn size="small" color="green-lighten-3" @click="validate" icon>
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn class="ml-2" size="small" color="blue-grey-lighten-4" @click="reset" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="3" offset="7" class="pl-2">
      <v-text-field variant="outlined" label="Champ visé" density="comfortable" v-model="parameter.field" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { cloneDeep, find } from 'lodash';

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => []
    },
    index: {
      type: Number,
      default: () => -1,
    },
  },
  computed: {
    parameter() {
      return this.modelValue;
    },
  },
  methods: {
    validate() {
      const result = cloneDeep(this.parameter)
      if (this.index < 0) {
        this.$emit("created", result);
      }
      else {
        this.$emit("updated", result);
      }
    },
    reset() {
      this.$emit("reset");
    }
  },
}
</script>