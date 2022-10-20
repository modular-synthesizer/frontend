<template>
  <v-dialog v-model="creationDialog">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">Add new</v-btn>
    </template>
    <v-card class="mx-auto" width="50%">
      <template v-slot:title>Ajouter un paramètre</template>
      <v-card-text>
        <v-form @submit.prevent="create">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <div class="text-h5">Informations générales</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="parameter.name"
                  variant="outlined"
                  label="Nom du paramètre"
                  hint="Ce nom sera utilisé comme clef de traduction"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="parameter.value"
                  type="number"
                  variant="outlined"
                  label="Valeur par défaut"
                  hint="Cette valeur sera donné au paramètre à l'instanciation des noeuds"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="text-h5">Contraintes</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="parameter.constraints.minimum"
                  label="Minimum"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="parameter.constraints.maximum"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="parameter.constraints.step"
                />
              </v-col>
              <v-col xs="12" sm="6" md="3">
                <v-text-field
                  variant="outlined"
                  v-model="parameter.constraints.precision"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" type="submit">Créer</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import ICategory from '~~/lib/interfaces/ICategory';
import type { PropType } from 'vue'
import IParameter from '~~/lib/interfaces/IParameter';

export default {
  props: {
    parameter: {
      type: Object as PropType<IParameter>,
      required: true
    }
  },
  data: () => ({
    creationDialog: false,
    categories: [] as ICategory[],
  }),
  methods: {
    create() {
      this.$emit("created", this.parameter);
      this.creationDialog = false;
    }
  }
}
</script>