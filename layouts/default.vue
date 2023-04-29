<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
const sDrawer = ref(true);

//import Sidebar from "~~/components/layoutComponents/sidebar/Sidebar.vue";
//import Header from "~~/components/layoutComponents/header/Header.vue";
//useMeta({
//  title: "MaterialPro Free NuxtJs 3  Dashboard",
//});

const drawer = ref(undefined || true);
//const innerW = window.innerWidth;
const innerW = 1024;
const { mdAndUp, mdAndDown } = useDisplay();
onMounted(() => {
  if (innerW < 950) {
    drawer.value = !drawer.value;
  }
});
</script>
<template>
    <v-app>

  <!------Sidebar-------->
  <v-navigation-drawer left elevation="0" class="leftSidebar" v-model="sDrawer">
    <!---Logo part -->
    <div class="pa-5">
      LOGO
    </div>

    <!---Navigation -->
    <div>
        <v-list class="pa-6">
            <!---Menu Loop -->
            <v-list-subheader 
              color="darkText"
              class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold">
                Home
            </v-list-subheader>

            <v-list-item
                  to="/signup"
                  rounded
                  class="mb-1"
                  active-color="primary"
              >
                  <!---If icon-->
                  <template v-slot:prepend>
                      <!-- <Icon :item="item.icon" :level="level" /> -->
                      Icon
                  </template>
                  <v-list-item-title>Dashboard</v-list-item-title>
                  <!---If Caption-->
                  <!---If any chip or label-->
              </v-list-item>
              
            <!-- <template v-for="(item, i) in sidebarMenu">
                <NavGroup :item="item" v-if="item.header" :key="item.title" />
                <NavItem :item="item" v-else class="leftPadding" />
            </template> -->
        </v-list>
        <div class="pa-4">
            <!-- <ExtraBox /> -->
        </div>
    </div>
  </v-navigation-drawer>  
  <v-app-bar elevation="0" height="70">
  </v-app-bar>
</v-app>

</template>
