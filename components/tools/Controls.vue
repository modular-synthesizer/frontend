<template>
  <v-row>
    <v-col cols="12">
      <v-form ref="controls-form" class="mt-5">
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
            v-model="control.component"
            density="comfortable"
            label="composant"
            variant="outlined"
            :items="components"
          />
          </v-col>
          <v-col cols="8" class="flex-shrink-1 pl-2 pr-3">
            <v-combobox
              v-model="chips"
              chips
              :multiple="true"
              @update:model-value="setPayloadValue"
              closable-chips
              :density="chips.length === 0 ? 'comfortable' : 'compact'"
              variant="outlined"
              label="payload"
              hint="Entrez les couples clefs/valeur sous la forme k=v et appuyez sur Entrée"
            />
          </v-col>
          <v-col cols="1" class="flex-grow-1 pr-2">
            <v-btn variant="flat" color="primary" size="large" @click="submitNewControl">Ajouter</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
    <v-col cols="12">
      <v-table>
        <thead>
          <tr>
            <th>UUID</th>
            <th>Components</th>
            <th>Payload</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="control in controls">
            <td>{{ control.id }}</td>
            <td>{{ control.component }}</td>
            <td>
              <v-chip
                size="small"
                closable
                class="mr-1"
                v-for="(value, name) in control.payload"
                @click:close="removePayloadValue(control, `${name}=${value}`)"
              >
                {{ name }} = {{ value }}
              </v-chip>
            </td>
            <td>
              <v-btn variant="plain" @click="deleteControl(control)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { cloneDeep, flatten, omit, remove } from 'lodash';
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import { IControl } from '~~/lib/interfaces/IControl';

export default {
  props: {
    modelValue: {
      type: Array<IControl>,
      default: () => []
    }
  },
  data: () => ({
    control: ToolsFactory.emptyControl(),
    chips: [] as string[],
    components: [
      'SmallKnob', 'LargeKnob', 'Knob', 'Port'
    ],
  }),
  computed: {
    controls() { return this.modelValue; }
  },
  methods: {
    removePayloadValue(control: IControl, name: string) {
      control.payload = omit(control.payload, name);
    },
    setPayloadValue(value: any) {
      const filtered: string[] = value.filter((v: string) => /^[a-zA-z]+\=.+$/.test(v));
      const mapped = flatten(filtered.map((v: string) => v.split(" ")))
      this.control.payload = Object.fromEntries(mapped.map(v => v.split("=")));
      this.chips = mapped;
    },
    submitNewControl() {
      this.controls.push(cloneDeep(this.control));
      this.control = ToolsFactory.emptyControl();
    },
    deleteControl(control: IControl) {
      remove(this.controls, control);
    }
  }
}
</script>