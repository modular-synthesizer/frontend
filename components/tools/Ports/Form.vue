<template>
  <v-form class="mt-5">
    <v-row no-gutters>
      <v-col cols="4" class="pr-2">
        <v-text-field v-model="port.name" variant="outlined" density="comfortable" label="Nom" />
      </v-col>
      <v-col cols="2" class="pr-2">
        <v-select :items="['input', 'output']" v-model="port.kind" label="Type" density="comfortable" variant="outlined" />
      </v-col>
      <v-col cols="2" class="pr-2">
        <v-text-field type="number" v-model="port.index" variant="outlined" density="comfortable" label="Index" />
      </v-col>
      <v-col cols="2" class="pr-2">
        <v-select :items="innerNodes" variant="outlined" density="comfortable" label="Cible" v-model="port.target" />
      </v-col>
      <v-col cols="2">
        <v-btn size="small" color="green-lighten-3" @click="validate" icon>
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn class="ml-2" size="small" color="blue-grey-lighten-4" @click="reset" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { PropType } from 'vue';
import { IToolPort } from '~~/lib/interfaces/ITool';

export default {
  props: {
    modelValue: {
      type: Object as PropType<IToolPort>,
        required: true
    },
    innerNodes: {
      type: Array<String>,
      default: () => []
    },
    index: {
      type: Number,
      default: () => -1
    }
  },
  computed: {
    port() {
      return this.modelValue;
    }
  },
  methods: {
    reset() {
      this.$emit("reset")
    },
    validate() {
      const result: IToolPort = cloneDeep(this.port);
      if (this.index < 0) {
        this.$emit("created", result);
      }
      else {
        this.$emit("updated", this.index, result);
      }
    }
  }
}
</script>