<template>
  <tools-links-form v-model="link" :creation-mode="creationMode" @created="addLink" @reset="reset" />
  <tools-links-list :links="links" />
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { InnerLink } from '~~/lib/interfaces/ITool';

function emptyLink(): InnerLink {
  return { id: "", from: {node: "", index: 0}, to: {node: "", index: 0} };
}

export default {
  props: {
    modelValue: {
      type: Array<InnerLink>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    link: emptyLink()
  }),
  computed: {
    links() { return this.modelValue; }
  },
  methods: {
    addLink() {
      this.links.push(cloneDeep(this.link));
      this.reset();
    },
    reset() {
      this.link = emptyLink();
    }
  }
}
</script>