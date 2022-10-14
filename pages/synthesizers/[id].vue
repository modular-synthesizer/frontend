<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        {{ synthesizer }}
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts">import { mapState } from 'pinia';
import { useLoginStore } from '~~/lib/stores/login';
import Api from "~~/lib/api/Api";
import Synthesizer from '~~/lib/wrappers/Synthesizer';

export default {
  data() {
    return {
      synthesizer: null as Synthesizer || null,
      api: new Api(useRuntimeConfig())
    }
  },
  computed: {
    ...mapState(useLoginStore, ['token'])
  },
  mounted() {
    this.api.get('/synthesizers/' + this.$route.params.id, {auth_token: this.token})
      .then(response => {
        this.synthesizer = new Synthesizer(response);
      })
  }
}
</script>