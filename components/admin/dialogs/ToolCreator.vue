<template>
  <v-dialog v-model="creationDialog" width="50%">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">Add new</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validForm" ref="form">
      <v-card>
        <template v-slot:title>Création d'outil</template>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>Informations générales</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container fluid>
                  <v-row>
                    <v-col xs="12" md="6">
                      <v-select
                        variant="outlined"
                        :items="categories"
                        item-title="name"
                        item-value="id"
                        label="Catégorie"
                        v-model="category"
                        @update:modelValue="tool.category_id = category.id"
                      />
                    </v-col>
                    <v-col xs="12" md="6">
                      <v-text-field variant="outlined" label="Nom de l'outil" required v-model="tool.name" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Noeuds internes</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container fluid>
                  <inner-node-form :tool="tool" @submitted="addInnerNode" />
                  <v-row>
                    <v-col cols="12">
                      <v-table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Générateur</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="node in tool.inner_nodes">
                            <td>{{ node.name }}</td>
                            <td>{{ node.generator }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Liens internes</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container fluid>
                  <inner-links-form :tool="tool" @submitted="addInnerLink" />
                  <v-row>
                    <v-col cols="12">
                      <v-table>
                        <thead>
                          <tr>
                            <th>Depuis</th>
                            <th>Vers</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="link in tool.inner_links">
                            <td>{{ link.from.node }}.{{ link.from.index }}</td>
                            <td>{{ link.to.node }}.{{ link.to.index }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" type="submit">Créer</v-btn>
          <v-btn @click="creationDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import type { PropType } from 'vue'
import ICategory from '~~/lib/interfaces/ICategory';
import ITool, { InnerLink, InnerNode } from '~~/lib/interfaces/ITool';
import { useCategories } from '~~/lib/stores/categories';
import { find, cloneDeep } from 'lodash'
import InnerNodeForm from './InnerNodeForm.vue';
import InnerLinksForm from './InnerLinksForm.vue';

export default {
    props: {
        tool: {
            type: Object as PropType<ITool>,
            required: true
        }
    },
    data: () => ({
        category: null as ICategory,
        validForm: true,
        creationDialog: false,
        innerNode: { name: "", generator: "" },
    }),
    computed: {
        ...mapState(useCategories, ["categories"]),
    },
    methods: {
        create() {
            console.log(this.tool);
        },
        addInnerNode(node: InnerNode) {
            this.tool.inner_nodes.push(node);
        },
        addInnerLink(link: InnerLink) {
          console.log(link);
          this.tool.inner_links.push(cloneDeep(link));
        },
        uniqueNodeName() {
            return !find(this.tool.inner_nodes, { name: this.innerNode.name }) || "name.uniq";
        }
    },
    mounted() {
        this.category = this.categories[0];
        this.tool.category_id = this.category.id;
    },
    components: { InnerNodeForm, InnerLinksForm }
}
</script>