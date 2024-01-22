<template>
  <v-container>
    <v-row>
      <!-- Self hosted radio -->
      <v-col cols="6" class="text-center">
        <NuxtLink to="/radio">
          <v-badge :content="self_hosted_radios.length">
            <v-card class="mx-auto" width="400">
              <v-card-text>
                <div class="text-center"><v-icon icon="mdi-server-network" size="200"></v-icon></div>
                <div class="text-center">{{ $t('radios.self_hosted.title') }}</div>
              </v-card-text>
            </v-card>
          </v-badge>
        </NuxtLink>
      </v-col>

      <!-- Hosted radio -->
      <v-col cols="6" class="text-center">
        <NuxtLink to="/radio">
          <v-badge :content="hosted_radios.length">
            <v-card class="mx-auto" width="400">

              <v-card-text>
                <div class="text-center"><v-icon icon="mdi-radio" size="200"></v-icon></div>
                <div class="text-center">{{ $t('radios.hosted.title') }}</div>
              </v-card-text>
            </v-card>
          </v-badge>
        </NuxtLink>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col cols="12" class="text-center"><NuxtLink to="/radio/wizard">{{ $t('radio.wizard') }}</NuxtLink></v-col>
    </v-row>

    <v-row>

      <!-- Android Apps -->
      <v-col cols="6" class="text-center">
        <NuxtLink to="/apps/android">
        <v-badge :content="android_apps.length">
          <v-card class="mx-auto" width="400">

            <v-card-text>
              <div class="text-center"><v-icon icon="mdi-android" size="200"></v-icon></div>
              <div class="text-center">{{ $t('nav_android') }}</div>
            </v-card-text>
          </v-card>
        </v-badge>
      </NuxtLink>
      </v-col>

      <!-- iOS Apps -->
      <v-col cols="6" class="text-center">
        <NuxtLink to="/apps/ios">
        <v-badge :content="ios_apps.length">
          <v-card class="mx-auto" width="400">

            <v-card-text>
              <div class="text-center"><v-icon icon="mdi-apple" size="200"></v-icon></div>
              <div class="text-center">{{ $t('nav_ios') }}</div>
            </v-card-text>
          </v-card>
        </v-badge>
      </NuxtLink>
      </v-col>
    </v-row>
    <v-row no-gutters md="12">
      <v-col cols="12" class="text-center">Create new</v-col>
    </v-row>

  </v-container>
</template>
  
<script setup>
import { useUserStore } from '@/stores/user.js';
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: "default",
  middleware: 'auth',
});

const userStore = useUserStore();
let self_hosted_radios = ref([]);
let hosted_radios = ref([]);
let self_hosted_radios_loading = ref(false);
let hosted_radios_loading = ref(false);

let android_apps = ref([]);
let android_apps_loading = ref(false);

let ios_apps = ref([]);
let ios_apps_loading = ref(false);

const config = useRuntimeConfig();


async function reloadSelfHostedRadios() {
  let response;
  self_hosted_radios.value = [];
  self_hosted_radios_loading.value = true;
  try {
    response = await useFetchAuth(`${config.public.baseURL}/self_hosted_radio/`);
  }
  catch (e) {
  }
  self_hosted_radios.value = response.data.value || [];
  self_hosted_radios_loading.value = false;
}

async function reloadHostedRadios() {
  let response;
  hosted_radios.value = [];
  hosted_radios_loading.value = true;
  try {
    response = await useFetchAuth(`${config.public.baseURL}/hosted_radio/`);
  }
  catch (e) {
  }
  hosted_radios.value = response.data.value || [];
  hosted_radios_loading.value = false;
}

async function reloadAndroidApps() {
  let response;
  android_apps.value = [];
  android_apps_loading.value = true;
  try {
    response = await useFetchAuth(`${config.public.baseURL}/mobile_apps/android/`);
  }
  catch (e) {
  }
  android_apps.value = response.data.value || [];
  android_apps_loading.value = false;
}

async function reloadIosApps() {
  let response;
  ios_apps.value = [];
  ios_apps_loading.value = true;
  try {
    response = await useFetchAuth(`${config.public.baseURL}/mobile_apps/ios/`);
  }
  catch (e) {
  }
  ios_apps.value = response.data.value || [];
  ios_apps_loading.value = false;
}


onMounted(() => {
  reloadSelfHostedRadios();
  reloadHostedRadios();

  reloadAndroidApps();
  reloadIosApps();
})



</script>
