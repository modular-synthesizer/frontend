<template>
  <v-dialog v-model="display" fullscreen>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ $t('modules.creator.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="display = false" :disabled="loading">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <data-fetcher url="/tools">
        <template v-slot="{ items: tools }">
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
      </data-fetcher>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { groupBy } from 'lodash';
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import ModulesFactory from '~~/lib/factories/ModulesFactory';
import { IGenerator } from '~~/lib/interfaces/IGenerator';
import IModule from '~~/lib/interfaces/IModule';
import ITool from '~~/lib/interfaces/ITool';
import Tool from '~~/lib/interfaces/ITool';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

export default {
  data: () => ({
    display: false,
    loading: false,
  }),
  props: {
    synthesizer: {
      type: Synthesizer,
      required: true
    }
  },
  computed: {
    ...mapState(useAuthentication, ['session']),
  },
  methods: {
    close() {
      this.loading = false;
      this.display = false;
    },
    select(tool: ITool) {
      this.loading = true;
      const payload = {
        auth_token: this.session.token,
        tool_id: tool.id,
        synthesizer_id: this.synthesizer.id,
        rack: 0,
        slot: this.synthesizer.firstFreeSlot(tool.slots),
      };
      api.post('/modules', payload).then(async (response: IModule) => {
        const generators: IGenerator[] = await api.auth_get("/generators");
        ModulesFactory.build(response, this.synthesizer, generators).then((mod: Mod) => {
          this.$emit('selected', mod);
          this.close();
        })
      })
    },
    categories(tools: Tool[]) {
      return groupBy(tools, tool => tool.category.name);
    },
  }
}
</script>