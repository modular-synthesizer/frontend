<template>
  <v-dialog v-model="creationDialog">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validForm" ref="form">
      <v-card class="mx-auto" width="50%">
        <template v-slot:title>{{ $t('descriptors.dialog.title')}}</template>
        <v-card-text>
          <div class="text-h5">{{ $t('descriptors.dialog.steps.informations') }}</div>
          <v-container fluid>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="descriptor.name"
                  variant="outlined"
                  :label="$t('common.name')"
                  :rules="[nameRequired]"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="descriptor.default"
                  type="number"
                  variant="outlined"
                  :label="$t('descriptors.dialog.fields.default.label')"
                  :hint="$t('descriptors.dialog.fields.default.hint')"
                  :min="descriptor.minimum"
                  :max="descriptor.maximum"
                  @update:modelValue="debouncedClamp"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="text-h5">{{ $t('descriptors.dialog.steps.constraints') }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model.number="descriptor.minimum"
                  :label="$t('descriptors.dialog.fields.minimum.label')"
                  type="number"
                  @update:modelValue="debouncedClamp"
                  :max="descriptor.maximum - descriptor.step"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="descriptor.maximum"
                  :label="$t('descriptors.dialog.fields.maximum.label')"
                  type="number"
                  :min="descriptor.minimum + descriptor.step"
                  @update:modelValue="debouncedClamp"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="descriptor.step"
                  :label="$t('descriptors.dialog.fields.step.label')"
                  type="number"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  :label="$t('descriptors.dialog.fields.precision.label')"
                  v-model="descriptor.precision"
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
import { clamp, cloneDeep, debounce } from 'lodash'
import IDescriptor from '~~/lib/interfaces/tools/IDescriptor';

export default {
  props: {
    descriptor: {
      type: Object as PropType<IDescriptor>,
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
      const form = this.$refs.form as any;
      form.validate();
      if (this.validForm) {
        this.$emit("created", cloneDeep(this.descriptor));
        form.reset();
        form.resetValidation();
        this.creationDialog = false;
      }
    },
    nameRequired() {
      return this.descriptor.name !== "" || "parameters.name.required"
    },
    debouncedClamp: () => {
      debounce(() => {
        const desc: IDescriptor = (this as any).descriptor;
        desc.default = clamp(desc.default, desc.minimum, desc.maximum);
      }, 250);
    },
  }
}
</script>