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
                <NuxtLink :to="'/apps/android/' + item.id + '/'">{{ item.title }}</NuxtLink>
              </td>
              <td>
                
                <NuxtLink :to="'/apps/android/' + item.id + '/'"><v-btn icon="mdi-pencil"></v-btn></NuxtLink>
                <v-btn @click=openPushNotificationDialog(item.id) v-if="item.is_paid && item.enable_push" icon="mdi-message-badge-outline" :title="$t('apps.send_push')"></v-btn>
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
</template>
  
<script setup>
const config = useRuntimeConfig();


let android_apps = ref([]);
let apps_loading = ref(false);

definePageMeta({
  layout: "default",
});


function openPushNotificationDialog(app_id){
  console.log("sendPushNotification: ", app_id);
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

</script>
