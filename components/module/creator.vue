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
      <v-container v-for="(cat_tools, category) in tools">
        <v-row>
          <v-col cols="12">
            <div class="text-h4">{{ $t(`categories.names.${category}`) }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-list>
              <v-list-item
                :disabled="loading"
                v-for="tool in cat_tools"
                :key="`${category}.${tool.name}`"
                :value="tool"
                :title="$t(`modules.${category}.${tool.name}.title`)"
                :subtitle="$t(`modules.${category}.${tool.name}.description`)"
                @click="select(tool)"
              />
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { PropType } from 'vue';
import { api } from '~~/lib/api/Api';
import IModule from '~~/lib/interfaces/IModule';
import ITool from '~~/lib/interfaces/ITool';
import { useAuthentication } from '~~/lib/stores/authentication';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

type ToolsList = {[key: string]: Array<ITool>};

export default {
  data: () => ({
    display: false,
    loading: false,
  }),
  props: {
    tools: {
      type: Object as PropType<ToolsList>,
      default: []
    },
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
        ...this.synthesizer.firstFreeSlot(tool.slots),
      };
      if (payload.slot === -1 || payload.rack === -1) {
        this.close();
      }
      else {
        api.post('/modules', payload).then((response: IModule) => {
          this.$emit('selected', new Mod(response));
          this.close();
        })
      }
    },
  }
}
</script>