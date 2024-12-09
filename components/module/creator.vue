<template>
  <v-dialog v-model="display" fullscreen>
    <template v-slot:activator="{ props }">
      <v-tooltip location="bottom">
        <template #activator="{ props: tooltipProps }">
          <v-btn v-bind="{ ... props, ...tooltipProps }" icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Ajouter de nouveaux modules</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ $t('modules.creator.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="display = false" :disabled="loading">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <template v-if="tools">
        <v-container v-for="(category, name) in categories(tools)">
          <v-row>
            <v-col cols="12">
              <div class="text-h4">{{ $t(`categories.names.${name}`) }}</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-list>
                <v-list-item
                  :disabled="loading"
                  v-for="tool in category"
                  :key="`${name}.${tool.name}`"
                  :value="tool"
                  :title="$t(`modules.${name}.${tool.name}.title`)"
                  :subtitle="$t(`modules.${name}.${tool.name}.description`)"
                  @click="select(tool)"
                />
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { groupBy } from 'lodash';
import ModulesFactory from '~~/lib/factories/ModulesFactory';
import { IGenerator } from '~~/lib/interfaces/IGenerator';
import IModule from '~~/lib/interfaces/modules/IModule';
import ITool from '~~/lib/interfaces/ITool';
import Tool from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

export default {
  data: () => ({
    display: false,
    loading: false,
    tools: [] as ITool[],
  }),
  props: {
    synthesizer: {
      type: Synthesizer,
      required: true
    }
  },
  methods: {
    close() {
      this.loading = false;
      this.display = false;
    },
    async select(tool: ITool) {
      this.loading = true;
      const payload = {
        tool_id: tool.id,
        synthesizer_id: this.synthesizer.id,
        rack: 0,
        slot: this.synthesizer.firstFreeSlot(tool.slots),
      };
      const response: IModule = await repositories.modules.createInSynthesizer(payload)
      const generators: IGenerator[] = await repositories.generators.list();
      ModulesFactory.build(response, this.synthesizer, generators).then((mod: Mod) => {
        this.$emit('selected', mod);
        this.close();
      });
    },
    categories(tools: Tool[]) {
      return groupBy(tools, tool => tool.category.name);
    },
  },
  async mounted() {
    this.tools = await repositories.tools.list();
  }
}
</script>