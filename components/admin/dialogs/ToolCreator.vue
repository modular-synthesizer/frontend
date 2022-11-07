<template>
  <v-dialog v-model="creationDialog" width="50%">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validForm" ref="form">
      <v-card>
        <template v-slot:title>{{ $t('tools.dialog.title') }}</template>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('tools.dialog.steps.informations') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container fluid>
                  <v-row>
                    <v-col xs="12" lg="4">
                      <v-select
                        variant="outlined"
                        density="compact"
                        :items="categories"
                        item-title="name"
                        item-value="id"
                        :label="$t('tools.dialog.fields.category.label')"
                        v-model="category"
                        @update:modelValue="tool.category_id = category.id"
                      />
                    </v-col>
                    <v-col xs="12" lg="4">
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        :label="$t('tools.dialog.fields.name.label')"
                        :hint="$t('tools.dialog.fields.name.hint')"
                        :rules="[nameRequired, nameLength]"
                        required
                        v-model="tool.name"
                      />
                    </v-col>
                    <v-col xs="12" lg="4">
                      <v-text-field
                        type="number"
                        variant="outlined"
                        density="compact"
                        :label="$t('tools.dialog.fields.slots.label')"
                        required
                        v-model="tool.slots" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('tools.dialog.steps.inner_nodes') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container fluid>
                  <inner-node-form :tool="tool" @submitted="addInnerNode" />
                  <v-row>
                    <v-col cols="12">
                      <v-table>
                        <thead>
                          <tr>
                            <th>{{ $t('tools.dialog.headers.name') }}</th>
                            <th>{{ $t('tools.dialog.headers.generator') }}</th>
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
              <v-expansion-panel-title>{{ $t('tools.dialog.steps.inner_links') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container fluid>
                  <inner-links-form :tool="tool" @submitted="addInnerLink" />
                  <v-row>
                    <v-col cols="12">
                      <v-table>
                        <thead>
                          <tr>
                            <th>{{ $t('tools.dialog.headers.from') }}</th>
                            <th>{{ $t('tools.dialog.headers.to') }}</th>
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
              <v-expansion-panel-title>{{ $t('tools.dialog.steps.ports') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <ports-form :tool="tool" @submitted="addPort" />
                <v-table>
                  <thead>
                    <tr>
                      <th>{{ $t('tools.dialog.headers.type') }}</th>
                      <th>{{ $t('tools.dialog.headers.name') }}</th>
                      <th>{{ $t('tools.dialog.headers.target') }}</th>
                      <th>{{ $t('tools.dialog.headers.index') }}</th>
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
              <v-expansion-panel-title>{{ $t('tools.dialog.steps.parameters') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <parameters-form :tool="tool" @submitted="addParameter" />
                <v-table>
                  <thead>
                    <tr>
                      <th>{{ $t('tools.dialog.headers.targets') }}</th>
                      <th>{{ $t('tools.dialog.headers.descriptor') }}</th>
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
          <v-btn color="primary" @click="create()">{{ $t('common.validate') }}</v-btn>
          <v-btn @click="creationDialog = false">{{ $t('common.close') }}</v-btn>
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
import InnerNodeForm from '../forms/InnerNodeForm.vue';
import InnerLinksForm from '../forms/InnerLinksForm.vue';
import PortsForm from '../forms/PortsForm.vue'
import ParametersForm from '../forms/ParametersForm.vue'
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
      ...mapState(useCategories, ["categories"]),
    },
    methods: {
        create() {
          this.tool.category_id = this.category;
          if(this.$refs.form.validate()) {
            this.$emit('created', cloneDeep(this.tool));
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
            this.creationDialog = false;
          }
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
        },
        nameLength() {
          return this.tool.name.length > 3 || "tools.dialog.errors.name.short"
        },
        nameRequired() {
          return !!this.tool.name || "tools.dialog.errors.name.required"
        }
    },
    mounted() {
        if (this.categories > 0) {
          this.category = this.categories[0];
          this.tool.category_id = this.category.id;
        }
    },
    components: { InnerNodeForm, InnerLinksForm, ParametersForm, PortsForm }
}
</script>