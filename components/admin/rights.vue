<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
        <solo-field-form v-model="right.label" @submitted="add" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12">
        <RightsTable v-slot="{ right }" :rights="rights">
          <v-btn icon small variant="plain" @click="remove(right)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </RightsTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useRights } from '~~/stores/permissions/rights';
import SoloFieldForm from '~~/components/common/SoloFieldForm.vue';
import IRight from '~~/lib/interfaces/permissions/IRight';
import RightsTable from "./utils/RightsTable.vue";

export default {
  name: "AdminRights",
  components: { SoloFieldForm, RightsTable },
  data: () => ({
    right: { label: '' } as IRight
  }),
  computed: {
    ...mapState(useRights, ['rights']),
    headers() {
      return [
        { 'title': this.$t('common.uuid'), key: 'id' },
        { 'title': this.$t('common.label'), key: 'label' },
        { 'title': this.$t('common.actions') },
      ]
    },
  },
  methods: {
    ...mapActions(useRights, ['add', 'remove']),
  },
}
</script>

<script lang="ts" setup>
useRights().init();
</script>