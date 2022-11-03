<template>
  <v-dialog v-model="creationDialog">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validForm" ref="form">
      <v-card class="mx-auto" width="50%">
        <template v-slot:title>{{ $t('parameters.dialog.title')}}</template>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <div class="text-h5">{{ $t('parameters.dialog.steps.informations') }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="parameter.name"
                  variant="outlined"
                  :label="$t('common.name')"
                  :rules="[nameRequired]"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="parameter.value"
                  type="number"
                  variant="outlined"
                  :label="$t('parameters.dialog.fields.default.label')"
                  :hint="$t('parameters.dialog.fields.default.hint')"
                  :min="parameter.constraints.minimum"
                  :max="parameter.constraints.maximum"
                  @update:modelValue="debouncedClamp"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="text-h5">{{ $t('parameters.dialog.steps.constraints') }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="parameter.constraints.minimum"
                  :label="$t('parameters.dialog.fields.minimum.label')"
                  type="number"
                  @update:modelValue="debouncedClamp"
                  :max="parameter.constraints.maximum - parameter.constraints.step"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="parameter.constraints.maximum"
                  :label="$t('parameters.dialog.fields.maximum.label')"
                  type="number"
                  :min="parameter.constraints.minimum + parameter.constraints.step"
                  @update:modelValue="debouncedClamp"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="parameter.constraints.step"
                  :label="$t('parameters.dialog.fields.step.label')"
                  type="number"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  :label="$t('parameters.dialog.fields.precision.label')"
                  v-model="parameter.constraints.precision"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn color="primary" type="submit">{{ $t('common.validate') }}</v-btn>
          <v-btn @click="creationDialog = false">{{ $t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import ICategory from '~~/lib/interfaces/ICategory';
import type { PropType } from 'vue'
import IParameter from '~~/lib/interfaces/IParameter';
import { clamp, debounce } from 'lodash'

export default {
  props: {
    parameter: {
      type: Object as PropType<IParameter>,
      required: true,
    }
  },
  data: () => ({
    creationDialog: false,
    categories: [] as ICategory[],
    validForm: true,
  }),
  methods: {
    create() {
      this.$refs.form.validate();
      if (this.validForm) {
        this.$emit("created", this.parameter);
        this.creationDialog = false;
      }
    },
    nameRequired() {
      return this.parameter.name !== "" || "parameters.name.required"
    },
    debouncedClamp: debounce(function() {
      if (this != undefined) {
        // @ts-ignore
        this.parameter.value = clamp(
          this.parameter.value,
          this.parameter.constraints.minimum,
          this.parameter.constraints.maximum
        )
      }
    }, 250)
  }
}
</script>