<template>
  <v-dialog :persistent="true" v-model="display" class="welcome-dialog">
    <v-card>
      <template v-slot:title>Bienvenue sur Synple</template>
      <v-card-text>
        Notre but : vous permettre de créer simplement des synthétiseurs
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="loading" variant="text" @click="click">
          <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate size="30" />
          </div>
          <span v-else>Close</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  data: () => ({
    display: true,
    loading: false,
  }),
  methods: {
    click() {
      this.$emit("interacted");
      this.loading = true;
    }
  }
}
</script>

<style>
.welcome-dialog {
  max-width: 50%;
}
</style>