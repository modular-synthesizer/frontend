<template>
  <svg v-if="synthesizer !== null">
    <g :transform="`translate(${synthesizer.x} ${synthesizer.y}) scale(${synthesizer.scale} ${synthesizer.scale})`">
      <Rack v-for="rack in synthesizer.racks" :rack="rack" />
    </g>
  </svg>
</template>

<script lang="ts">import { mapState } from 'pinia';
import { useLoginStore } from '~~/lib/stores/login';
import Api from "~~/lib/api/Api";
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import Rack from '~~/components/synthesizers/Rack.vue';

export default {
  data() {
    return {
      synthesizer: null as Synthesizer || null,
      api: new Api(useRuntimeConfig())
    };
  },
  computed: {
    ...mapState(useLoginStore, ["token"])
  },
  mounted() {
    this.api.get("/synthesizers/" + this.$route.params.id, { auth_token: this.token })
      .then(response => {
        this.synthesizer = new Synthesizer(response);
      });
  },
  components: { Rack }
}
</script>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  background-color: silver;
}
</style>