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
              @click="startEdit(control, idx)"
              icon="mdi-pencil"
            />
            <v-btn
              size="small"
              variant="plain"
              @click="remove(control.id)"
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

<script setup lang="ts">
import { omit } from 'lodash';
import { IControl } from '~~/lib/interfaces/IControl';
import { repositories } from '~~/lib/repositories';

const { controls, creationMode } = defineProps({
  controls: { type: Array<IControl>, default: () => [] },
  creationMode: { type: Boolean, default: () => false }
});

type EditionPayload = { control: IControl, index: number };
const emit = defineEmits<{ edition: [ EditionPayload ]}>();

function shift(index: number, difference: number) {
  const item: IControl = controls.splice(index, 1)[0];
  controls.splice(index + difference, 0, item);
}
const remove = repositories.tool.controls.remove(controls)

function startEdit(control: IControl, index: number) {
  emit("edition", { control, index });
}
function removePayloadValue(control: IControl, value: string) {
  control.payload = omit(control.payload, value);
}
</script>