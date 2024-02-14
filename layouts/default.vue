<script setup>

import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
import { useUiStateStore } from '@/stores/ui'
import { BreadCrumbs } from '#components'
import { useUserStore } from '~/stores/user'


const stateUser = useUserStore()
const stateUI = useUiStateStore()


async function getUserData(){
  stateUI.setLoading(true);
  await stateUser.getUserData();
  stateUI.setLoading(false);
}

getUserData();
const sDrawer = ref(true);


const drawer = ref(undefined || true);
//const innerW = window.innerWidth;
const innerW = 1024;
const { mdAndUp, mdAndDown } = useDisplay();
onMounted(() => {
  if (innerW < 950) {
    drawer.value = !drawer.value;
  }
});

function Logout(){
  const router = useRouter();
  stateUser.Logout();
  router.push("/login");
}

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
          <v-list-item to="/" prepend-icon="mdi-home" rounded class="mb-1" active-color="primary" :title="$t('nav_home')"></v-list-item>

          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_streams')"></v-list-subheader>
          <v-list-item to="/radio" prepend-icon="mdi-radio" rounded class="mb-1" active-color="primary" :title="$t('nav_radio')"></v-list-item>

          <!-- Application -->
          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_apps')"></v-list-subheader>
          <v-list-item to="/apps/android" prepend-icon="mdi-android" rounded class="mb-1" active-color="primary" :title="$t('nav_android')"></v-list-item>
          <v-list-item to="/apps/ios" prepend-icon="mdi-apple" rounded class="mb-1" active-color="primary" :title="$t('nav_ios')"></v-list-item>

          <!-- Catalog -->
          <!-- <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_catalog')"></v-list-subheader>
          <v-list-item to="/catalog" prepend-icon="mdi-bookmark-box-multiple" rounded class="mb-1" active-color="primary" :title="$t('nav_catalog_stations')"></v-list-item> -->

          <!-- Billing -->
          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_billing')"></v-list-subheader>
          <v-list-item to="/billing" prepend-icon="mdi-cash" rounded class="mb-1" active-color="primary" :title="$t('nav_balance')"></v-list-item>

          <!-- Settings -->
          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_settings')"></v-list-subheader>
          <v-list-item to="/settings" prepend-icon="mdi-cash" rounded class="mb-1" active-color="primary" :title="$t('nav_settings_account')"></v-list-item>


        </v-list>

        <div class="pa-4">
          <!-- <ExtraBox /> -->
        </div>
      </div>
    </v-navigation-drawer>
    <v-app-bar elevation="0" height="70">
      <!-- <v-app-bar-nav-icon class="" @click="drawer = !drawer" /> -->
      <v-spacer></v-spacer>

      <NuxtLink v-if="stateUser && stateUser.user && stateUser.user.userData && stateUser.user.userData.balance !== null" to="/billing"><v-chip>{{stateUser.user.userData.email}} &nbsp;&nbsp; <span class="font-weight-black">{{stateUser.user.userData.balance}} {{ $t('currency')}}</span></v-chip></NuxtLink>
      <v-btn v-if="stateUser && stateUser.user" append-icon="mdi-logout" variant="plain" @click="Logout()">
        {{ $t('logout')}}
      </v-btn>

      <v-progress-linear
        :active="Boolean(stateUI.loading)"
        :indeterminate="Boolean(stateUI.loading)"
        absolute
        bottom
        color="indigo"
      ></v-progress-linear>
    </v-app-bar>
    
    <v-main>
      <BreadCrumbs />
      <slot />
    </v-main>
    
  </v-app>
</template>
