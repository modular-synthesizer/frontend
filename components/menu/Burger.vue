<template>
  <v-dialog fullscreen height="100%" v-model="menuModel">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" aria-label="main menu"><v-icon>mdi-menu</v-icon></v-btn>
    </template>
    <v-list height="100%">
      <v-list-item>
        <template v-slot:append>
          <v-list-item-action>
            <v-btn variant="text" icon @click="menuModel = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-divider></v-divider>
      <template v-for="item in props.items">
        <v-list-item :href="item.url" v-if="item.url">
          <v-list-item-title class="pl-2">{{ $t(item.label) }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="item.click" v-if="!item.url && item.click">
          <v-list-item-title class="pl-2">{{ $t(item.label) }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list>
  </v-dialog>
</template>


<script lang="ts" setup>
interface BurgerItem {
  label: string;
  url?: string;
  click?: Function
}

const props = defineProps({
  items: {
    type: Array<BurgerItem>,
    default: () => []
  }
})

const menuModel = ref(false);
</script>