<template>
  <v-dialog v-model="display" fullscreen>
    <template v-slot:activator="{ props }">
      <sp-button-with-tooltip v-bind="props" label="modules.add" />
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
import type { Generator } from '~/types/Generator';
import type { Tool } from '~~/types/tools/Tool';
import { repositories } from '~~/lib/repositories';
import type { ModulePayload } from '~/types/modules/AudioModule';
import { createModule } from '~/utils/factories/modules';
import { firstFreeSlot } from '~/utils/functions/synthesizers';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

export default {
  data: () => ({
    display: false,
    loading: false,
    tools: [] as Tool[],
  }),
  props: {
    synthesizer: {
      type: Object as PropType<Synthesizer>,
      required: true
    }
  },
  methods: {
    close() {
      this.loading = false;
      this.display = false;
    },
    async select(tool: Tool) {
      this.loading = true;
      const payload = {
        tool_id: tool.id,
        synthesizer_id: this.synthesizer.id,
        rack: 0,
        slot: firstFreeSlot(this.synthesizer, tool.slots),
      };
      const response: ModulePayload = await repositories.modules.createInSynthesizer(payload)
      const generators: Generator[] = await repositories.generators.list();
      await createModule(response, generators, this.synthesizer);
      this.close();
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