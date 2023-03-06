<template>
  <v-row class="mt-5" no-gutters>
    <v-col cols="3">
      <v-select
        variant="outlined"
        v-model="parameter.descriptorId"
        :items="descriptorsList"
        density="comfortable"
        label="Descripteur"
      />
    </v-col>
    <v-col cols="3" class="pl-2">
      <v-text-field variant="outlined" label="Nom" density="comfortable" v-model="parameter.name" />
    </v-col>
    <v-col cols="4" class="pl-2">
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
</template>

<script lang="ts">
import { cloneDeep, find } from 'lodash';
import { mapState } from 'pinia';

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
    ...mapState(useDescriptors, {descriptors: 'parameters'}),
    descriptorsList() {
      return this.descriptors.map(d => {
        const c = d.constraints;
        return {
          title: `${d.name} [${c.minimum};${c.maximum}] +/- ${c.step}p${c.precision}`,
          value: d.id
        }
      })
    }
  },
  methods: {
    validate() {
      const constraints = find(this.descriptors, {id: this.parameter.descriptorId})?.constraints
      if (constraints !== undefined) {
        const result = {...cloneDeep(this.parameter), constraints}
        if (this.index < 0) {
          this.$emit("created", result);
        }
        else {
          this.$emit("updated", result);
        }
      }
    },
    reset() {
      this.$emit("reset");
    }
  },
}
</script>