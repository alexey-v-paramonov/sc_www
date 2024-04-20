<template>
  <v-container class="index-container">
    <v-row>
      <!-- Self hosted radio -->
      <v-col cols="12" md="6" class="text-center">
        <NuxtLink to="/radio">
          <v-badge color="accent" class="bold-badge" :content="self_hosted_radios.length">
            <v-card elevation="0" class="index-icon ibg1 ma-auto" width="100%" style="min-height: 250px">
              <div class="d-flex flex-no-wrap justify-space-between text-left">
                <div>
                  <v-card-item>
                    <div>
                      <div class="text-overline mb-1">
                        {{ variant }}
                      </div>
                      <div class="h2 mb-1">
                        {{ $t('radios.self_hosted.title') }}
                      </div>
                      <div class="text-caption">{{ $t('radios.self_hosted.subtitle') }}</div>
                    </div>
                    <v-card-actions>
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <v-btn v-bind="props" :slim="false" variant="tonal" icon="mdi-plus" to="/radio/wizard"
                                 :color="isHovering ? 'primary' : 'grey-darken-1'"
                                 style="background: #FFF !important;"></v-btn>
                        </template>
                      </v-hover>
                    </v-card-actions>
                  </v-card-item>
                </div>
                <v-avatar
                    class="special-icon ma-3"
                    rounded="0"
                    size="100"
                >
                  <v-img src="/img/server-icon1.png"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-badge>
        </NuxtLink>
      </v-col>

      <!-- Hosted radio -->
      <v-col cols="12" md="6" class="text-center">
        <NuxtLink to="/radio">
          <v-badge color="accent" class="bold-badge" :content="hosted_radios.length">
            <v-card elevation="0" class="index-icon ibg2 ma-auto" width="100%" style="min-height: 250px">
              <div class="d-flex flex-no-wrap justify-space-between text-left">
                <div>
                  <v-card-item>
                    <div>
                      <div class="text-overline mb-1">
                        {{ variant }}
                      </div>
                      <div class="h2 mb-1">
                        {{ $t('radios.hosted.title') }}
                      </div>
                      <div class="text-caption">{{ $t('radios.hosted.subtitle') }}</div>
                    </div>
                    <v-card-actions>
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <v-btn v-bind="props" :slim="false" variant="tonal" icon="mdi-plus" to="/radio/wizard"
                                 :color="isHovering ? 'primary' : 'grey-darken-1'"
                                 style="background: #FFF !important;"></v-btn>
                        </template>
                      </v-hover>
                    </v-card-actions>
                  </v-card-item>
                </div>
                <v-avatar
                    class="special-icon ma-3"
                    rounded="0"
                    size="100"
                >
                  <v-img width="100" src="/img/server-icon2.png"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-badge>
        </NuxtLink>
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card elevation="0">
          <v-card-text>
            <v-row align="center" no-gutters>
              <v-col cols="3" style="min-width: 130px !important">
                <v-img src="/img/phone.png"></v-img>
              </v-col>
              <v-col>
                <div class="h3 mb-2">{{ $t('index.builder') }}</div>
                <div>
                  {{ $t('index.builder_desc') }}
                </div>
                <div>
                  <v-list lines="one">
                    <v-defaults-provider :defaults="{'VIcon':{'color':'light-green-darken-1'}}">
                      <v-list-item prepend-icon="mdi-check">{{ $t('index.builder_features1') }}</v-list-item>
                    </v-defaults-provider>
                    <v-defaults-provider :defaults="{'VIcon':{'color':'light-green-darken-1'}}">
                      <v-list-item prepend-icon="mdi-check">{{ $t('index.builder_features2') }}</v-list-item>
                    </v-defaults-provider>
                    <v-defaults-provider :defaults="{'VIcon':{'color':'light-green-darken-1'}}">
                      <v-list-item prepend-icon="mdi-check">{{ $t('index.builder_features3') }}</v-list-item>
                    </v-defaults-provider>
                  </v-list>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <NuxtLink to="/apps/android">
          <v-badge color="grey-lighten-4" :content="android_apps.length">
            <v-card elevation="0" class="mx-auto">

              <v-card-text class="text-center">
                <div class="text-center mt-3">
                  <v-icon icon="custom:android" color="light-green" size="70"></v-icon>
                </div>

                <div class="h3 text-center mt-2 mb-4">{{ $t('nav_android') }}</div>
                <v-btn :slim="false" elevation="0" to="/apps/wizard" color="primary">{{ $t('apps.wizard') }}</v-btn>
              </v-card-text>
            </v-card>
          </v-badge>
        </NuxtLink>
      </v-col>
      <v-col cols="6" md="3">
        <NuxtLink to="/apps/ios">
          <v-badge color="grey-lighten-4" style="font-weight: normal !important;" :content="ios_apps.length">
            <v-card elevation="0" class="mx-auto">

              <v-card-text class="text-center">
                <div class="text-center mt-3">
                  <v-icon icon="custom:apple" color="#b5bbc5" size="70"></v-icon>
                </div>

                <div class="h3 text-center mt-2 mb-4">{{ $t('nav_ios') }}</div>
                <v-btn :slim="false" elevation="0" to="/apps/wizard" color="primary">{{ $t('apps.wizard') }}</v-btn>
              </v-card-text>
            </v-card>
          </v-badge>
        </NuxtLink>
      </v-col>
    </v-row>


  </v-container>
</template>

<script setup>
import {useUserStore} from '@/stores/user.js';
import {ref, onMounted} from 'vue';

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
    response = await fetchAuth(`${config.public.baseURL}/self_hosted_radio/`);
  } catch (e) {
  }
  self_hosted_radios.value = response || [];
  self_hosted_radios_loading.value = false;
}

async function reloadHostedRadios() {
  let response;
  hosted_radios.value = [];
  hosted_radios_loading.value = true;
  try {
    response = await fetchAuth(`${config.public.baseURL}/hosted_radio/`);
  } catch (e) {
  }
  hosted_radios.value = response || [];
  hosted_radios_loading.value = false;
}

async function reloadAndroidApps() {
  let response;
  android_apps.value = [];
  android_apps_loading.value = true;
  try {
    response = await fetchAuth(`${config.public.baseURL}/mobile_apps/android/`);
  } catch (e) {
  }
  android_apps.value = response || [];
  android_apps_loading.value = false;
}

async function reloadIosApps() {
  let response;
  ios_apps.value = [];
  ios_apps_loading.value = true;
  try {
    response = await fetchAuth(`${config.public.baseURL}/mobile_apps/ios/`);
  } catch (e) {
  }
  ios_apps.value = response || [];
  ios_apps_loading.value = false;
}


onMounted(() => {
  reloadSelfHostedRadios();
  reloadHostedRadios();

  reloadAndroidApps();
  reloadIosApps();
})


</script>
<style>
.index-container {
  max-width: 1100px;
}

.index-container .v-badge,
.index-container .v-badge__wrapper {
  height: 100%;
  width: 100%;
}

.index-container .v-badge .v-badge__badge {
  bottom: calc(100% - 40px) !important;
  left: calc(100% - 40px) !important;
  min-width:30px;
  height:30px;
  border-radius:15px;
  font-size: 16px;
  padding-bottom: 6px;
}

.index-container .v-badge.bold-badge .v-badge__badge {
  font-weight: 700;
}

.v-card.index-icon {
  height: 100%;
  position: relative;
  padding: 1rem;
}

.index-icon .v-card-actions {
  height: 64px;
}

.index-icon .v-card-actions .v-btn {
  position: absolute;
  bottom: 85px;
  left: 2rem;
}

.v-card.ibg1 {
  background: white url(/img/ibgg.jpg) top center no-repeat;;
  background-size: cover;
}

.v-card.ibg2 {
  background: white url(/img/ibgg.jpg) top center no-repeat;;
  background-size: cover;
}

.v-avatar.special-icon {
  padding: 1rem;
  background: #eee;
  border-radius: 50% !important;
  position: absolute;
  right: 0;
  bottom: 0;
}

.index-constructor {
  background-image: url('/img/cbg.png');
  background-repeat: repeat;
  background-size: auto;
}

.index-container .v-list-item--density-default.v-list-item--one-line {
  min-height: 30px;
}

.index-container .v-list-item__prepend > .v-icon ~ .v-list-item__spacer {
  width: 16px;
}

</style>
