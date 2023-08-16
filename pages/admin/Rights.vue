<template>
  <v-container class="wrapped">
    <v-row class="d-sm-block d-none">
      <v-col cols="12" md="8" offset-md="2" lg="6" offset-lg="3">
        <v-data-table
          v-if="rights.populated"
          :headers="headers"
          :items="rights.all()"
        >
          <template v-slot:item.groups="{ item }">
            {{ item.props.title.groups.length }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="d-block d-sm-none">
      <v-col v-for="right in rights.all()" cols="12">
        <v-card>
          <template v-slot:title>{{ right.label }}</template>
          <template v-slot:subtitle>{{ right.id }}</template>
          <template v-slot:text>Lié à {{ right.groups.length }} groupe(s)</template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const rights = ref(await useLists().rights);

const headers = [
  { title: t('id'), key: 'id' },
  { title: t('label'), key: 'label' },
  { title: t('groups'), key: 'groups' },
];
</script>

<style scoped>
.wrapped {
  height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>