<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VTable>
          <thead>
            <tr>
              <th>{{ $t('common.uuid') }}</th>
              <th>{{ $t('common.name') }}</th>
              <th>Liens</th>
              <th>Noeuds</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="synthesizer in synthesizers">
              <td>{{ synthesizer.id }}</td>
              <td>{{ synthesizer.name }}</td>
              <td>{{ synthesizer.links_count }}</td>
              <td>{{ synthesizer.nodes_count }}</td>
              <td>
                <VBtn size="x-small" variant="tonal" icon :to="`/synthesizers/${synthesizer.id}`">
                  <VIcon>mdi-pencil</VIcon>
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts">
import ISynthesizer from "~~/lib/interfaces/ISynthesizer";

export default {
  props: {
    synthesizers: {
      type: Array<ISynthesizer>,
      default: () => []
    }
  }
}
</script>