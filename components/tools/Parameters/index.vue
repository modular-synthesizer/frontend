<template>
  <tools-parameters-form v-model="parameter" :index="index" @created="addParameter" @updated="updateParameter" @reset="reset" />
  <tools-parameters-list :parameters="parameters" :creation-mode="creationMode" @edition="startEdit" />
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { IToolParameter } from '~~/lib/interfaces/ITool';

function emptyParameter() {
  return {id: "", name: "", targets: [] as string[], descriptorId: ""}
}

export default {
  props: {
    modelValue: {
      type: Array<IToolParameter>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    parameter: emptyParameter(),
    index: -1,
  }),
  computed: {
    parameters() { return this.modelValue; },
    ...mapState(useDescriptors, {descriptors: 'parameters'}),
    descriptorsList() {
      return this.descriptors.map(d => ({title: d.name, value: d.id}))
    }
  },
  methods: {
    addParameter(result: IToolParameter) {
      this.parameters.push(result);
      this.reset();
    },
    updateParameter(result: IToolParameter) {
      this.parameters[this.index] = result;
      this.reset();
    },
    reset() {
      this.parameter = emptyParameter();
      this.index = -1;
      this.resetDescriptor()
    },
    resetDescriptor() {
      this.parameter.descriptorId = this.descriptors[0].id;
    },
    startEdit(index: number) {
      this.index = index;
      const parameter = this.parameters[index];
      this.parameter = {
        id: parameter.id,
        name: parameter.name,
        targets: parameter.targets,
        descriptorId: `${parameter.descriptorId}`
      }
    }
  },
  mounted() {
    useDescriptors().fetchDescriptors().then(() => {
      this.resetDescriptor();
    })
  }
}
</script>