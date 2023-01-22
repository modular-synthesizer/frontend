<template>
  <v-col cols="12">
    <v-table>
      <thead>
        <tr>
          <th v-if="!creationMode">UUID</th>
          <th>Components</th>
          <th>Payload</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(control, idx) in controls">
          <td v-if="!creationMode">{{ control.id }}</td>
          <td>{{ control.component }}</td>
          <td>
            <tools-controls-payload :control="control" @closed="removePayloadValue" />
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
              @click="remove(idx)"
              icon="mdi-delete"
            />
            <v-btn
              size="small"
              variant="plain"
              icon="mdi-chevron-up"
              @click="shift(idx, -1)"
              :disabled="idx == 0"
            />
            <v-btn
              size="small"
              variant="plain"
              icon="mdi-chevron-down"
              @click="shift(idx, 1)"
              :disabled="idx > controls.length - 2"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-col>
</template>

<script lang="ts">
import { omit, remove } from 'lodash';
import { IControl } from '~~/lib/interfaces/IControl';

export default {
  props: {
    controls: {
      type: Array<IControl>,
      default: () => []
    },
    creationMode: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    shift(index: number, difference: number) {
      const item: IControl = this.controls.splice(index, 1)[0];
      this.controls.splice(index + difference, 0, item);
    },
    remove(index: number) {
      remove(this.controls, this.controls[index]);
    },
    startEdit(index: number) {
      this.$emit("edition", index);
    },
    removePayloadValue(control: IControl, value: string) {
      control.payload = omit(control.payload, value);
    }
  }
}
</script>