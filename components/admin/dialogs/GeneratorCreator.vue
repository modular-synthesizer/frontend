<template>
  <v-dialog v-model="display">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validForm" ref="form">
      <v-card class="mx-auto" width="50%" v-if="display">
        <template v-slot:title>{{ $t('generators.dialog.title')}}</template>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="generator.name"
                variant="outlined"
                label="Nom du générateur"
                :rules="[requiredName, uniqName]"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="generator.code"
                variant="outlined"
                label="Code du générateur"
                :rules="[requiredCode]"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn color="primary" type="submit">{{ $t('common.validate') }}</v-btn>
          <v-btn @click="display = false">{{ $t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useGenerators } from '~~/lib/stores/tools/generators';

export default {
  data: () => ({
    generator: {
      name: "",
      code: ""
    },
    display: false,
    validForm: true,
  }),
  computed: {
    ...mapState(useGenerators, ['generators'])
  },
  methods: {
    create() {
      if (this.$refs.form.validate()) {
        this.$emit('created', {
          name: this.generator.name,
          code: this.generator.code,
        });
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.display = false;
      }
    },
    requiredName() {
      return !!this.generator.name || "Nom requis"
    },
    uniqName() {
      return this.generators.indexOf(this.generator.name) < 0 || "Nom déjà utilisé"
    },
    requiredCode() {
      return !!this.generator.code || "Code requis"
    }
  }
}
</script>