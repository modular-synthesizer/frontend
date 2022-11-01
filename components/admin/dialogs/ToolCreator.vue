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
                    <v-col xs="12" lg="4">
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
                    <v-col xs="12" lg="4">
                      <v-text-field variant="outlined" label="Nom de l'outil" required v-model="tool.name" />
                    </v-col>
                    <v-col xs="12" lg="4">
                      <v-text-field type="number" variant="outlined" label="Emplacements" required v-model="tool.slots" />
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
            <v-expansion-panel>
              <v-expansion-panel-title>Ports</v-expansion-panel-title>
              <v-expansion-panel-text>
                <ports-form :tool="tool" @submitted="addPort" />
                <v-table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Nom</th>
                      <th>Cible</th>
                      <th>Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="port in tool.inputs">
                      <td>Input</td>
                      <td>{{ port.name }}</td>
                      <td>{{ port.target }}</td>
                      <td>{{ port.index }}</td>
                    </tr>
                    <tr v-for="port in tool.outputs">
                      <td>Output</td>
                      <td>{{ port.name }}</td>
                      <td>{{ port.target }}</td>
                      <td>{{ port.index }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Paramètres</v-expansion-panel-title>
              <v-expansion-panel-text>
                <parameters-form :tool="tool" @submitted="addParameter" />
                <v-table>
                  <thead>
                    <tr>
                      <th>Cibles</th>
                      <th>Descripteur</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="param in tool.parameters">
                      <td>{{ param.targets.join(', ') }}</td>
                      <td>{{ param.descriptor }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" type="submit" @click="create()">Créer</v-btn>
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
import ITool, { InnerLink, InnerNode, IToolParameter } from '~~/lib/interfaces/ITool';
import { useCategories } from '~~/lib/stores/categories';
import { find, cloneDeep } from 'lodash'
import InnerNodeForm from './InnerNodeForm.vue';
import InnerLinksForm from './InnerLinksForm.vue';
import PortsForm from './PortsForm.vue'
import ParametersForm from './ParametersForm.vue'
import { api } from '~~/lib/api/Api';
import { useAuthentication } from '~~/lib/stores/authentication';

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
      ...mapState(useAuthentication, ['session']),
        ...mapState(useCategories, ["categories"]),
    },
    methods: {
        create() {
          this.tool.category_id = this.category;
          api.post("/tools", {auth_token: this.session.token, ...this.tool})
            .then(response => {
              console.log(response);
            })
        },
        addInnerNode(node: InnerNode) {
            this.tool.inner_nodes.push(node);
        },
        addInnerLink(link: InnerLink) {
          this.tool.inner_links.push(cloneDeep(link));
        },
        addPort({ type, port }) {
          if (type === "input") {
            this.tool.inputs.push(port);
          }
          else {
            this.tool.outputs.push(port);
          }
        },
        addParameter(param: IToolParameter) {
          this.tool.parameters.push(param);
        },
        uniqueNodeName() {
            return !find(this.tool.inner_nodes, { name: this.innerNode.name }) || "name.uniq";
        }
    },
    mounted() {
        this.category = this.categories[0];
        this.tool.category_id = this.category.id;
    },
    components: { InnerNodeForm, InnerLinksForm, ParametersForm, PortsForm }
}
</script>