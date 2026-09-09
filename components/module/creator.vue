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
      <template v-if="blueprints">
        <v-container v-for="(category, name) in categories(blueprints)">
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
                  v-for="blueprint in category"
                  :key="`${name}.${blueprint.name}`"
                  :value="blueprint"
                  :title="$t(`modules.${name}.${blueprint.name}.title`)"
                  :subtitle="$t(`modules.${name}.${blueprint.name}.description`)"
                  @click="select(blueprint)"
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
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import { repositories } from '~~/lib/repositories';
import { firstFreeSlot } from '~/utils/functions/synthesizers';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import type { AudioModule } from '~/types/Index';

export default {
  data: () => ({
    display: false,
    loading: false,
    blueprints: [] as Blueprint[],
  }),
  props: {
    synthesizer: {
      type: Object as PropType<Synthesizer>,
      required: true
    },
    modules: {
      type: Array<AudioModule>,
      default: () => []
    }
  },
  methods: {
    close() {
      this.loading = false;
      this.display = false;
    },
    async select(blueprint: Blueprint) {
      this.loading = true;
      const payload = {
        blueprint_id: blueprint.id,
        synthesizer_id: this.synthesizer.id,
        rack: 0,
        slot: firstFreeSlot(this.modules, blueprint.slots),
      };
      const created = await api_post("/proxy/modules", payload)
      this.$emit('selected', created);
      this.close();
    },
    categories(blueprints: Blueprint[]) {
      return groupBy(blueprints, blueprint => blueprint.category.name);
    },
  },
  async mounted() {
    this.blueprints = await repositories.blueprints.list();
  }
}
</script>