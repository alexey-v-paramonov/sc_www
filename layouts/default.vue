<script setup>

import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
import { useUiStateStore } from '@/stores/ui'
import { BreadCrumbs } from '#components'
import { useUserStore } from '~/stores/user'


const stateUser = useUserStore()
const stateUI = useUiStateStore()
const { user } =  storeToRefs(useUserStore());
const { locale } = useI18n();

const sDrawer = ref(true);
const display = ref(useDisplay())
const rail = ref(null)

async function getUserData(){
  stateUI.setLoading(true);
  await stateUser.getUserData();
  stateUI.setLoading(false);
}

getUserData();

onMounted(() => {
  const innerW = window.innerWidth;
  if (innerW < 950) {
    rail.value = !rail.value;
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
    <v-navigation-drawer
        left
        elevation="0"
        app
        class="leftSidebar"
        v-model="sDrawer"
    ><!-- :rail="rail"
        permanent
        absolute
        @click="rail = false"
        :class="rail?'collapsed':''"-->
      <!---Logo part -->
      <div class="pa-5" style="height:70px;opacity: 0.9">
        <div class="d-flex">
          <svg style="opacity: 0.8" width="33px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1388 1184" version="1.1"><path d="M 670.500 330.134 C 602.932 335.938, 538.257 369.486, 494.624 421.363 C 461.380 460.888, 441.203 506.680, 434.417 558 C 431.054 583.440, 432.506 617.150, 438.144 644.500 C 455.141 726.948, 515.517 799.543, 593.575 831.388 C 613.733 839.612, 630.283 844.325, 652.597 848.196 C 670.239 851.257, 714.123 851.509, 732 848.653 C 759.443 844.268, 784.042 836.499, 808.500 824.492 C 876.325 791.197, 926.475 729.976, 945.997 656.641 C 958.925 608.077, 957.110 555.185, 940.855 506.766 C 921.479 449.053, 881.817 399.462, 829.338 367.332 C 782.338 338.556, 726.012 325.366, 670.500 330.134" stroke="none" fill="#0043e2" fill-rule="evenodd"/><path d="M 320.437 10.894 C 184.390 98.747, 81.670 234.134, 34.669 387.541 C 4.932 484.601, -3.184 587.696, 11.054 687.500 C 36.873 868.486, 133.544 1031.113, 281.500 1142.469 C 298.705 1155.418, 333.174 1178.247, 334.047 1177.272 C 335.637 1175.496, 387.999 1089.237, 387.991 1088.408 C 387.986 1087.908, 385.174 1085.722, 381.741 1083.550 C 323.592 1046.747, 269.422 996.685, 226.952 940.500 C 205.106 911.599, 188.006 883.816, 170.635 849 C 142.610 792.828, 124.241 733.994, 115.530 672.500 C 108.975 626.223, 108.240 570.473, 113.564 523.500 C 132.904 352.896, 228.922 197.311, 373.383 102.492 C 381.422 97.216, 388 92.491, 388 91.994 C 388 90.605, 334.437 3.638, 333.406 3.354 C 332.908 3.217, 327.071 6.610, 320.437 10.894 M 1042.874 19.750 C 1009.088 74.795, 999 91.425, 999 92.075 C 999 92.475, 1005.638 97.182, 1013.750 102.535 C 1101.102 160.170, 1171.089 239.352, 1217.011 332.500 C 1248.400 396.168, 1266.870 460.377, 1274.542 532.500 C 1276.713 552.903, 1277.577 605.898, 1276.092 627.506 C 1270.581 707.692, 1251.080 779.905, 1216.008 850.006 C 1185.998 909.990, 1149.928 959.398, 1101.371 1007.031 C 1073.013 1034.850, 1045.685 1056.962, 1014.057 1077.683 C 1005.815 1083.082, 999.056 1087.892, 999.036 1088.371 C 999.004 1089.140, 1051.290 1175.282, 1053.010 1177.294 C 1053.875 1178.306, 1088.148 1155.535, 1106.500 1141.756 C 1180.664 1086.071, 1242.026 1017.082, 1289.953 935.500 C 1300.613 917.353, 1322.127 873.893, 1330.544 853.500 C 1387.878 714.592, 1398.344 562.178, 1360.552 416.500 C 1321.615 266.410, 1231.405 132.471, 1105.701 38.113 C 1091.990 27.820, 1055.389 3, 1053.922 3 C 1053.500 3, 1048.529 10.537, 1042.874 19.750 M 432.890 199.831 C 335.654 265.192, 266.432 363.160, 238.108 475.500 C 219.362 549.851, 219.151 628.288, 237.497 702.500 C 265.799 816.984, 335.328 915.460, 434.803 981.950 C 441.569 986.473, 447.644 989.956, 448.303 989.690 C 449.474 989.216, 502.273 903.765, 502.733 901.598 C 502.862 900.994, 497.343 896.752, 490.469 892.171 C 450.978 865.851, 412.870 827.103, 387.527 787.500 C 364.719 751.859, 347.315 710.658, 338.525 671.500 C 332.064 642.715, 329.629 620.162, 329.674 589.500 C 329.756 532.771, 341.395 482.149, 366.001 431.500 C 383.652 395.167, 403.821 366.548, 432.500 337.138 C 453.803 315.292, 472.707 299.529, 494.334 285.578 C 499.278 282.389, 502.964 279.356, 502.705 278.690 C 501.775 276.300, 448.900 190.493, 448.211 190.255 C 447.820 190.121, 440.926 194.430, 432.890 199.831 M 911.250 234.450 C 896.263 258.894, 884 279.085, 884 279.317 C 884 279.549, 889.737 283.596, 896.750 288.310 C 927.196 308.776, 955.684 335.109, 978.697 364.057 C 1066.620 474.656, 1082.498 626.291, 1019.373 752.500 C 1001.223 788.787, 980.501 817.448, 951 847.065 C 932.992 865.143, 914.546 880.428, 895.995 892.644 C 889.432 896.965, 884.049 900.750, 884.031 901.055 C 883.965 902.233, 937.886 989.462, 938.888 989.796 C 939.471 989.990, 945.088 986.756, 951.369 982.608 C 1060.046 910.845, 1134.628 797.128, 1156.396 670 C 1163.994 625.625, 1165.082 575.154, 1159.402 530.500 C 1142.178 395.085, 1065.773 273.120, 950.878 197.635 C 944.486 193.436, 939.086 190.001, 938.878 190.002 C 938.670 190.003, 926.237 210.005, 911.250 234.450" stroke="none" fill="#000000" fill-rule="evenodd"/></svg>
          <div class="logo-text" v-if="locale=='ru'">
            радио.<br/>
            точка
          </div>

          <div class="logo-text">
            streaming.<br/>
            center
          </div>

        </div>
      </div>

      <!---Navigation -->
      <div>
        <perfect-scrollbar class="scrollnavbar">
        <v-list>
          <v-list-item to="/" prepend-icon="custom:home" rounded class="mb-1" color="primary" :title="$t('nav_home')"></v-list-item>
          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_streams')"></v-list-subheader>
          <v-list-item to="/radio" prepend-icon="custom:radio" rounded class="mb-1" color="primary" :title="$t('nav_radio')"></v-list-item>

          <!-- Application -->
          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_apps')"></v-list-subheader>
          <v-list-item to="/apps/android" prepend-icon="custom:android" rounded class="mb-1" color="primary" :title="$t('nav_android')"></v-list-item>
          <v-list-item to="/apps/ios" prepend-icon="custom:apple" rounded class="mb-1" color="primary" :title="$t('nav_ios')"></v-list-item>

          <!-- Catalog -->
          <!-- <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_catalog')"></v-list-subheader>
          <v-list-item to="/catalog" prepend-icon="mdi-bookmark-box-multiple" rounded class="mb-1" active-color="primary" :title="$t('nav_catalog_stations')"></v-list-item> -->

          <!-- Billing -->
          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_billing')"></v-list-subheader>
          <v-list-item to="/billing" prepend-icon="custom:payment " rounded class="mb-1" color="primary" :title="$t('nav_balance')"></v-list-item>

          <!-- Settings -->
          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold" :title="$t('nav_settings')"></v-list-subheader>
          <v-list-item to="/settings" prepend-icon="custom:account" rounded class="mb-1" color="primary" :title="$t('nav_settings_account')"></v-list-item>


        </v-list>

        <div class="pa-4">
          <!-- <ExtraBox /> -->
        </div>
        </perfect-scrollbar>
      </div>
    </v-navigation-drawer>
    <v-app-bar elevation="0" height="70" style="border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    border-style: solid;
    border-width: 0;
    border-bottom-width: 1px;">

      <v-btn class="ms-3" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
        <v-icon icon="mdi-menu" size="20" stroke-width="1.5" />
      </v-btn>

      <div :class="['pa-5 pl-2 second-logo',(!sDrawer?'active':'')]" style="height:70px;">
        <div class="d-flex"style="opacity: 0.9">
          <svg style="opacity: 0.8" width="33px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1388 1184" version="1.1"><path d="M 670.500 330.134 C 602.932 335.938, 538.257 369.486, 494.624 421.363 C 461.380 460.888, 441.203 506.680, 434.417 558 C 431.054 583.440, 432.506 617.150, 438.144 644.500 C 455.141 726.948, 515.517 799.543, 593.575 831.388 C 613.733 839.612, 630.283 844.325, 652.597 848.196 C 670.239 851.257, 714.123 851.509, 732 848.653 C 759.443 844.268, 784.042 836.499, 808.500 824.492 C 876.325 791.197, 926.475 729.976, 945.997 656.641 C 958.925 608.077, 957.110 555.185, 940.855 506.766 C 921.479 449.053, 881.817 399.462, 829.338 367.332 C 782.338 338.556, 726.012 325.366, 670.500 330.134" stroke="none" fill="#0043e2" fill-rule="evenodd"/><path d="M 320.437 10.894 C 184.390 98.747, 81.670 234.134, 34.669 387.541 C 4.932 484.601, -3.184 587.696, 11.054 687.500 C 36.873 868.486, 133.544 1031.113, 281.500 1142.469 C 298.705 1155.418, 333.174 1178.247, 334.047 1177.272 C 335.637 1175.496, 387.999 1089.237, 387.991 1088.408 C 387.986 1087.908, 385.174 1085.722, 381.741 1083.550 C 323.592 1046.747, 269.422 996.685, 226.952 940.500 C 205.106 911.599, 188.006 883.816, 170.635 849 C 142.610 792.828, 124.241 733.994, 115.530 672.500 C 108.975 626.223, 108.240 570.473, 113.564 523.500 C 132.904 352.896, 228.922 197.311, 373.383 102.492 C 381.422 97.216, 388 92.491, 388 91.994 C 388 90.605, 334.437 3.638, 333.406 3.354 C 332.908 3.217, 327.071 6.610, 320.437 10.894 M 1042.874 19.750 C 1009.088 74.795, 999 91.425, 999 92.075 C 999 92.475, 1005.638 97.182, 1013.750 102.535 C 1101.102 160.170, 1171.089 239.352, 1217.011 332.500 C 1248.400 396.168, 1266.870 460.377, 1274.542 532.500 C 1276.713 552.903, 1277.577 605.898, 1276.092 627.506 C 1270.581 707.692, 1251.080 779.905, 1216.008 850.006 C 1185.998 909.990, 1149.928 959.398, 1101.371 1007.031 C 1073.013 1034.850, 1045.685 1056.962, 1014.057 1077.683 C 1005.815 1083.082, 999.056 1087.892, 999.036 1088.371 C 999.004 1089.140, 1051.290 1175.282, 1053.010 1177.294 C 1053.875 1178.306, 1088.148 1155.535, 1106.500 1141.756 C 1180.664 1086.071, 1242.026 1017.082, 1289.953 935.500 C 1300.613 917.353, 1322.127 873.893, 1330.544 853.500 C 1387.878 714.592, 1398.344 562.178, 1360.552 416.500 C 1321.615 266.410, 1231.405 132.471, 1105.701 38.113 C 1091.990 27.820, 1055.389 3, 1053.922 3 C 1053.500 3, 1048.529 10.537, 1042.874 19.750 M 432.890 199.831 C 335.654 265.192, 266.432 363.160, 238.108 475.500 C 219.362 549.851, 219.151 628.288, 237.497 702.500 C 265.799 816.984, 335.328 915.460, 434.803 981.950 C 441.569 986.473, 447.644 989.956, 448.303 989.690 C 449.474 989.216, 502.273 903.765, 502.733 901.598 C 502.862 900.994, 497.343 896.752, 490.469 892.171 C 450.978 865.851, 412.870 827.103, 387.527 787.500 C 364.719 751.859, 347.315 710.658, 338.525 671.500 C 332.064 642.715, 329.629 620.162, 329.674 589.500 C 329.756 532.771, 341.395 482.149, 366.001 431.500 C 383.652 395.167, 403.821 366.548, 432.500 337.138 C 453.803 315.292, 472.707 299.529, 494.334 285.578 C 499.278 282.389, 502.964 279.356, 502.705 278.690 C 501.775 276.300, 448.900 190.493, 448.211 190.255 C 447.820 190.121, 440.926 194.430, 432.890 199.831 M 911.250 234.450 C 896.263 258.894, 884 279.085, 884 279.317 C 884 279.549, 889.737 283.596, 896.750 288.310 C 927.196 308.776, 955.684 335.109, 978.697 364.057 C 1066.620 474.656, 1082.498 626.291, 1019.373 752.500 C 1001.223 788.787, 980.501 817.448, 951 847.065 C 932.992 865.143, 914.546 880.428, 895.995 892.644 C 889.432 896.965, 884.049 900.750, 884.031 901.055 C 883.965 902.233, 937.886 989.462, 938.888 989.796 C 939.471 989.990, 945.088 986.756, 951.369 982.608 C 1060.046 910.845, 1134.628 797.128, 1156.396 670 C 1163.994 625.625, 1165.082 575.154, 1159.402 530.500 C 1142.178 395.085, 1065.773 273.120, 950.878 197.635 C 944.486 193.436, 939.086 190.001, 938.878 190.002 C 938.670 190.003, 926.237 210.005, 911.250 234.450" stroke="none" fill="#000000" fill-rule="evenodd"/></svg>
          <div class="logo-text">
            streaming.<br/>
            center
          </div>
        </div>
      </div>
      <!-- <v-app-bar-nav-icon class="" @click="drawer = !drawer" /> -->
      <v-spacer></v-spacer>

      <NuxtLink v-if="user && user.userData && user.userData.balance !== null" to="/billing">
        <v-chip variant="elevated" elevation="0" color="accent">
          <span v-if="display.smAndUp">{{user.userData.email}}</span> &nbsp;&nbsp; <span class="font-weight-black">{{user.userData.balance}} {{ $t('currency')}}</span>

        </v-chip>
      </NuxtLink>
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
      <v-btn v-bind="props" v-if="user" icon   :color="isHovering ? 'primary' : 'grey-darken-1'" class="bg-grey-lighten-5 ml-4 mr-4" variant="text" :title="$t('logout')" @click="Logout()" size="x-small">
        <!--{{ $t('logout')}}-->
        <v-icon icon="custom:logout" size="20" style="margin-right:-5px" />

      </v-btn>
        </template>
      </v-hover>

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
    <v-footer absolute class="text-center" :app="true">
      <div class="text-right">{{ $t('copyright') }}</div>
    </v-footer>
  </v-app>
</template>

