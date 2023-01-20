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
          <v-col cols="2" class="flex-grow-1 pr-2">
            <v-btn color="blue-grey-lighten-5" size="large" @click="submitNewControl">Valider</v-btn>
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
          <tr v-for="(control, idx) in controls">
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
              <v-btn
                size="small"
                variant="plain"
                @click="startEdit(idx)"
                icon="mdi-pencil"
              />
              <v-btn
                size="small"
                variant="plain"
                @click="deleteControl(control)"
                icon="mdi-delete"
              />
              <v-btn
                size="small"
                variant="plain"
                icon="mdi-chevron-up"
                @click="shiftItem(idx, -1)"
                :disabled="idx == 0"
              />
              <v-btn
                size="small"
                variant="plain"
                icon="mdi-chevron-down"
                @click="shiftItem(idx, 1)"
                :disabled="idx > controls.length - 2"
              />
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
    editIndex: -1,
  }),
  computed: {
    controls() { return this.modelValue; }
  },
  methods: {
    removePayloadValue(control: IControl, name: string) {
      control.payload = omit(control.payload, name);
    },
    setPayloadValue(value: any) {
      this.updateChips(value);
    },
    updateChips(values: string[]) {
      const filtered: string[] = values.filter((v: string) => /^[a-zA-z]+\=.+$/.test(v));
      const mapped = flatten(filtered.map((v: string) => v.split(" ")))

      const parsedValues = mapped.map(v => {
        const splitted = v.split("=");
        const value = /^[0-9]+$/.test(splitted[1]) ? Number(splitted[1]) : splitted[1];
        return [splitted[0], value]
      })
      this.control.payload = Object.fromEntries(parsedValues);
      this.chips = mapped;
    },
    submitNewControl() {
      this.updateChips(this.chips);
      const result: IControl = cloneDeep(this.control);
      if (this.editIndex <= -1) {
        this.controls.push(result);
      }
      else {
        this.controls[this.editIndex] = result;
      }
      this.control = ToolsFactory.emptyControl();
      this.chips = [];
      this.editIndex = -1;
    },
    deleteControl(control: IControl) {
      remove(this.controls, control);
    },
    shiftItem(index: number, shift: number) {
      const item: IControl = this.controls.splice(index, 1)[0];
      this.controls.splice(index + shift, 0, item);
    },
    startEdit(index: number) {
      this.editIndex = index;
      this.control = cloneDeep(this.controls[index]);
      this.chips = Object.entries(this.control.payload).map(t => `${t[0]}=${t[1]}`);
    }
  }
}
</script>