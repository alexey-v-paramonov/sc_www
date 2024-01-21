<template>
    <v-container>
      <v-row no-gutters md="6">
        <v-col>User area <NuxtLink to="/radio/wizard">{{ $t('radio.wizard') }}</NuxtLink>
        {{ self_hosted_radios.length }}
        {{ hosted_radios.length }}

        {{ android_apps.length }}
        {{ ios_apps.length }}

        
        </v-col>
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
let android_apps_loading  = ref(false);

let ios_apps = ref([]);
let ios_apps_loading  = ref(false);

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
