<template>
  <v-form class="mt-5">
    <v-row no-gutters>
      <v-col cols="3">
        <v-text-field density="comfortable" variant="outlined" v-model="link.from.node" label="Depuis le noeud" />
      </v-col>
      <v-col cols="2" class="pl-2">
        <v-text-field density="comfortable" variant="outlined" v-model="link.from.index" type="number" label="Index" />
      </v-col>
      <v-col cols="3" class="pl-2">
        <v-text-field density="comfortable" variant="outlined" v-model="link.to.node" label="Vers le noeud" />
      </v-col>
      <v-col cols="2" class="pl-2">
        <v-text-field density="comfortable" variant="outlined" v-model="link.to.index" type="number" label="Index" />
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
  </v-form>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { PropType } from 'vue';
import { InnerLink } from '~~/lib/interfaces/ITool';
export default {
  props: {
    modelValue: {
      type: Object as PropType<InnerLink>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    link(): InnerLink {
      return this.modelValue;
    }
  },
  methods: {
    reset() {
      this.$emit("reset");
    },
    validate() {
      this.$emit("created", cloneDeep(this.link));
    }
  }
}
</script>