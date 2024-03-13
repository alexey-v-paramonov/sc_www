<template>
  <v-container>
    <v-row no-gutters md="12">
      <v-col class="text-right">
        <v-btn prepend-icon="mdi-plus" to="/apps/wizard" color="primary">{{ $t('apps.wizard') }}</v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
    <v-col>
      <div class="text-h5">{{ $t('nav_ios') }}</div>
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

          <tr v-if="ios_apps.length > 0" v-for="item in ios_apps" :key="item.id">
            <td><NuxtLink :to="'/apps/ios/' + item.id + '/'">{{ item.title }}</NuxtLink></td>
            <td>
              <NuxtLink :to="'/apps/ios/' + item.id + '/'"><v-btn icon="mdi-pencil"></v-btn></NuxtLink>
              <v-btn @click=openPushNotificationDialog(item.id) v-if="item.is_paid && item.enable_push"
                  icon="mdi-message-badge-outline" :title="$t('apps.send_push')"></v-btn>

            </td>
          </tr>

          <tr v-else-if="apps_loading">
            <td colspan="10" class="text-center"><v-progress-circular indeterminate></v-progress-circular></td>
          </tr>

          <tr v-else>
            <td class="text-center" colspan="3">
              <br />
              {{ $t('apps.ios_empty') }}
              <br />
              <br />

              <iframe width="560" height="315" src="https://www.youtube.com/embed/SMSvpNqAAFU?si=gl1Eh_WPYsmVzDDB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

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
  <PushDialog v-model="pushNotificationDialog" platform="ios" :id="app_push_id" />

</template>

<script setup>
const config = useRuntimeConfig();


let ios_apps = ref([]);
let apps_loading = ref(false);
let pushNotificationDialog = ref(false);
let app_push_id = 0;

definePageMeta({
  layout: "default",
});


function openPushNotificationDialog(app_id) {
  pushNotificationDialog.value = true;
  app_push_id = app_id;
}


async function reloadIosApps() {
let response;
ios_apps.value = [];
apps_loading.value = true;
try {
  response = await fetchAuth(`${config.public.baseURL}/mobile_apps/ios/`);
}
catch (e) {
}
ios_apps.value = response || [];
apps_loading.value = false;
}

reloadIosApps();

</script>
