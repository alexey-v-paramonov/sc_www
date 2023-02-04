<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Nuxt 3 & Vuetify 3 Template</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-btn>The Button</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  data: () => ({
    drawer: null,
  }),
};
</script>