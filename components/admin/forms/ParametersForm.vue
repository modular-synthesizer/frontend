<template>
  <v-form @submit.prevent="submit" ref="form">
    <v-container fluid>
      <v-row>
        <v-col xs="12" md="6">
          <v-autocomplete
            :multiple="true"
            :items="tool.innerNodes"
            v-model="parameter.targets"
            :label="$t('tools.dialog.fields.targets.label')"
            variant="outlined"
            density="compact"
            item-title="name"
            item-value="name"
          />
        </v-col>
        <v-col xs="12" md="4">
          <!-- Load all parameters descriptors into that select. Put descriptors in a store shared with the parameters tab-->
          <v-autocomplete
            variant="outlined"
            density="compact"
            :items="descriptors"
            :label="$t('tools.dialog.fields.descriptor.label')"
            v-model="descriptor"
          />
        </v-col>
        <v-col xs="12" md="2">
          <v-btn @click="submit">{{ $t('common.add') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { PropType } from 'vue';
import IParameter from '~~/lib/interfaces/IParameter';
import ITool, { IToolParameter } from '~~/lib/interfaces/ITool';
import { useDescriptors } from '~~/lib/stores/descriptors';
import { cloneDeep } from "lodash"

export default {
  data: () => ({
    descriptor: null,
    parameter: {
      targets: [],
      descriptor: null
    } as IToolParameter
  }),
  computed: {
    ...mapState(useDescriptors, ['parameters']),
    descriptors() {
      return this.parameters.map((param: IParameter) => {
        const c = param.constraints;
        return {
          title: `${param.name} [${c.minimum};${c.maximum}] +/- ${c.step} p${c.precision}`,
          value: param.id
        }
      })
    }
  },
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  mounted() {
    this.fetchDescriptors();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.parameter.descriptor = this.descriptor
        this.$emit("submitted", cloneDeep(this.parameter));
        this.$refs.form.reset();
      }
    },
    ...mapActions(useDescriptors, ['fetchDescriptors']),
  }
}
</script>