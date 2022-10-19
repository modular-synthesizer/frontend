<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VTable>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Name</th>
              <th>Liens</th>
              <th>Noeuds</th>
              <th>Actions</th>
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
import { mapState } from "pinia";
import { api } from "~~/lib/api/Api";
import { useAuthentication } from "~~/lib/stores/authentication";

export default {
  data() {
    return {
      synthesizers: []
    }
  },
  computed: {
    ...mapState(useAuthentication, ['session'])
  },
  mounted() {
    api.get('/synthesizers', {auth_token: this.session.token})
      .then(response => {
        this.synthesizers = response.synthesizers;
      })
  }
}
</script>