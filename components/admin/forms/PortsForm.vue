<template>
  <v-form @submit.prevent="submit" ref="form">
    <v-container fluid>
      <v-row>
        <v-col xs="4" md="2">
          <v-select
            :items="types"
            v-model="type"
            variant="outlined"
            density="compact"
            :label="$t('tools.dialog.fields.type.label')"
          />
        </v-col>
        <v-col xs="8" md="3">
          <v-text-field
            v-model="port.name"
            variant="outlined"
            density="compact"
            :label="$t('common.name')"
            :rules="[nameRequired]"
          />
        </v-col>
        <v-col xs="8" md="3">
          <v-text-field
            v-model="port.target"
            variant="outlined"
            density="compact"
            :label="$t('tools.dialog.fields.node.label')"
            :rules="[targetRequired, validTarget]"
          />
        </v-col>
        <v-col xs="4" md="2">
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            v-model="port.index"
            :label="$t('common.index')"
            minimum="0"
          />
        </v-col>
        <v-col xs="12" md="2">
          <v-btn @click="submit">{{ $t('common.add') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';
import { cloneDeep } from "lodash"
import { find } from 'lodash';

export default {
  props: {
    tool: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  computed: {
    innerNodes(): string[] {
      return this.tool.innerNodes.map(n => n.name)
    }
  },
  data: () => ({
    type: null,
    types: ['input', 'output'],
    port: {
      target: null,
      name: null,
      index: 0
    }
  }),
  methods: {
    submit() {
      console.log("submission", this.port);
      if (this.$refs.form.validate()) {
        this.$emit("submitted", {type: this.type, port: cloneDeep(this.port)});
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }
    },
    nameRequired() {
      return !!this.port.name || this.$t("ports.name.required");
    },
    targetRequired() {
      return !!this.port.target || this.$t("ports.target.required");
    },
    validTarget() {
      const targetExists: boolean = !!find(this.tool.innerNodes, node => {
        return this.port.target.startsWith(node.name)
      });
      return targetExists || this.$t("ports.target.unknown");
    }
  }
}
</script>