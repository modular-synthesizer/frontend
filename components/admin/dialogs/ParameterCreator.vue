<template>
  <v-dialog
    v-model="creationDialog"
    :fullscreen="fullscreen"
    :scrim="!fullscreen"
    width="auto"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn icon color="primary" size="large" class="fab" v-bind="props">
        <v-icon size="x-large" color="white">mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="creationDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <div class="text-h5 mb-6">{{ $t('parameters.dialog.steps.informations') }}</div>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="parameter.name"
              variant="outlined"
              :label="$t('common.name')"
              :rules="[nameRequired]"
              required
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="parameter.field"
              variant="outlined"
              :label="$t('parameters.dialog.fields.field.label')"
              :rules="[fieldRequired]"
              required
            />
          </v-col>
          <v-col cols="12" sm="4">
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
        <div class="text-h5 mb-6">{{ $t('parameters.dialog.steps.constraints') }}</div>
        <v-row>
          <v-col cols="6" md="3">
            <v-text-field
              variant="outlined"
              v-model.number="parameter.constraints.minimum"
              :label="$t('parameters.dialog.fields.minimum.label')"
              type="number"
              @update:modelValue="debouncedClamp"
              :max="parameter.constraints.maximum - parameter.constraints.step"
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              variant="outlined"
              v-model="parameter.constraints.maximum"
              :label="$t('parameters.dialog.fields.maximum.label')"
              type="number"
              :min="parameter.constraints.minimum + parameter.constraints.step"
              @update:modelValue="debouncedClamp"
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              variant="outlined"
              v-model="parameter.constraints.step"
              :label="$t('parameters.dialog.fields.step.label')"
              type="number"
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              variant="outlined"
              :label="$t('parameters.dialog.fields.precision.label')"
              v-model="parameter.constraints.precision"
              type="number"
              min="0"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-space-between">
        <v-btn color="primary" type="submit">{{ $t('common.validate') }}</v-btn>
        <v-btn @click="creationDialog = false">{{ $t('common.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">                                                                                                     
import ICategory from '~~/lib/interfaces/ICategory';
import type { PropType } from 'vue'
import IParameter from '~~/lib/interfaces/IParameter';
import { clamp, cloneDeep, debounce } from 'lodash'
import { useDisplay } from 'vuetify';

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
  computed: {
    fullscreen() {
      return useDisplay().xs.value;
    }
  },
  methods: {
    create() {
      this.$refs.form.validate();
      if (this.validForm) {
        this.$emit("created", cloneDeep(this.parameter));
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.creationDialog = false;
      }
    },
    nameRequired() {
      return this.parameter.name !== "" || "parameters.name.required"
    },
    fieldRequired() {
      return this.parameter.field !== "" || "parameters.field.required"
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

<style scoped>
.fab {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
}
</style>