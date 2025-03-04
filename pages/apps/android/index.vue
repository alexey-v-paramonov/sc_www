<template>
  <v-container>
    <v-row no-gutters md="12">
      <v-col class="text-right">
        <v-btn prepend-icon="mdi-plus" to="/apps/wizard" color="primary">{{ $t('apps.wizard') }}</v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h5">{{ $t('nav_android') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('apps.app_name') }}
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>

            <tr v-if="android_apps.length > 0" v-for="item in android_apps" :key="item.id">
              <td>
                <NuxtLink :to="'/apps/android/' + item.id + '/'"><v-icon v-if="display.smAndUp" icon="mdi-cellphone-text" class="mr-4" />{{ item.title }}</NuxtLink>
              </td>
              <td :width="display.smAndUp?'150':'100'" style="padding: 0">

                <NuxtLink :to="'/apps/android/' + item.id + '/'"><v-btn :density="display.smAndUp?'default':'compact'" icon="mdi-pencil"></v-btn></NuxtLink>

                <v-btn :density="display.smAndUp?'default':'compact'" :href="item.store_url" v-if="item.store_url"  target="_blank"
                  icon="mdi-android"></v-btn>

                <v-btn :density="display.smAndUp?'default':'compact'" @click=openPushNotificationDialog(item.id) v-if="item.is_paid && item.enable_push"
                  icon="mdi-message-badge-outline" :title="$t('apps.send_push')"></v-btn>

                <v-btn v-if="!item.is_paid" icon="mdi-delete" @click="deleteApp(item)" :disabled="item.beingDeleted"></v-btn>
              </td>
            </tr>

            <tr v-else-if="apps_loading">
              <td colspan="10" class="text-center"><v-progress-circular indeterminate></v-progress-circular></td>
            </tr>

            <tr v-else>
              <td class="text-center" colspan="3">
                <br />
                {{ $t('apps.android_empty') }}
                <br />
                <div class="h4 mt-4 mb-3">{{ $t('apps.android_free_try') }}</div>
                <br />
                <br />

                <iframe width="560" height="315" src="https://www.youtube.com/embed/SMSvpNqAAFU?si=gl1Eh_WPYsmVzDDB"
                  title="YouTube video player" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen></iframe>

                <br />
                <br />

                {{ $t('apps.android_sample_apps') }} <a class="font-weight-bold text-decoration-underline" href="https://play.google.com/store/apps/developer?id=iRadioService" target="_blank">Google Play</a>
                <br />
                <br />

                <br />
                <br />
                <v-btn color="primary" to="/apps/wizard" class="mt-2">{{ $t('apps.wizard') }}</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

    </v-row>

  </v-container>
  <PushDialog v-model="pushNotificationDialog" platform="android" :id="app_push_id"
    @push-result="showPushResultNotification" />
  <v-snackbar v-model="pushFailed" color="error">
    {{ $t('apps.push_failed') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="pushFailed = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="pushSuccess" color="success">
    {{ $t('apps.push_success') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="pushSuccess = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>

  <v-dialog v-model="delAppDialog" width="auto">
    <v-card>
      <v-card-text>
        <div class="py-12 text-center">
          <v-icon class="mb-6" color="error" icon="mdi-alert-decagram" size="128"></v-icon>

          <div class="text-h4 font-weight-bold">{{ $t('apps.android.delete_confirmation') }}</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey" @click="answerDialog(false)">{{ $t('cancel') }}</v-btn>
        <v-btn variant="outlined" color="primary" @click="answerDialog(true)">{{ $t('delete') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="deleteAppFailed" color="error">
    {{ $t('apps.android.delete_failed') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteAppFailed = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>


  <v-snackbar v-model="deleteAppSuccess" color="success">
    {{ $t('apps.android.delete_success') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteAppSuccess = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>

</template>

<script setup>

const config = useRuntimeConfig();


let android_apps = ref([]);
let apps_loading = ref(false);
let app_push_id = 0;
let pushNotificationDialog = ref(false);
let pushFailed = ref(false);
let pushSuccess = ref(false);
let answerDialog = ref();
let deleteAppFailed = ref(false);
let deleteAppSuccess = ref(false);
let delAppDialog = ref(false);

import { useDisplay } from 'vuetify'
const display = ref(useDisplay())

definePageMeta({
  layout: "default",
});


function openPushNotificationDialog(app_id) {
  pushNotificationDialog.value = true;
  app_push_id = app_id;
}

function showPushResultNotification(result) {
  if (result) {
    pushSuccess.value = true;
  }
  else {
    pushFailed.value = true;
  }
}

async function reloadAndroidApps() {
  let response;
  android_apps.value = [];
  apps_loading.value = true;
  try {
    response = await fetchAuth(`${config.public.baseURL}/mobile_apps/android/`);
  }
  catch (e) {
  }
  android_apps.value = response || [];
  apps_loading.value = false;
}

reloadAndroidApps();

function deleteApp(app) {
  delAppDialog.value = true;
  new Promise((resolve) => {
    answerDialog = resolve;
  }).then((res) => {
    delAppDialog.value = false;
    if(res){
      clearNuxtData();
      app.beingDeleted = true;

      fetchAuth(`${config.public.baseURL}/mobile_apps/android/${app.id}/`, { method: 'DELETE' }).then(
        (r) => {
            deleteAppSuccess.value = true;
            reloadAndroidApps();
        },
        (e) => {
          deleteAppFailed.value = true;
        }
      ).finally(() => {
        app.beingDeleted = false;
      });
    }
  })
}

</script>
