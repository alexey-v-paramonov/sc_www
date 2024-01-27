<template>
  <v-container>

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
            <td><NuxtLink :to="'/apps/ios/' + item.id + '/'"><v-btn icon="mdi-pencil" @click="deleteRadio(item)" :disabled="item.beingDeleted"></v-btn></NuxtLink></td>
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


let ios_apps = ref([]);
let apps_loading = ref(false);

definePageMeta({
layout: "default",
});



async function reloadIosApps() {
let response;
ios_apps.value = [];
apps_loading.value = true;
try {
  response = await useFetchAuth(`${config.public.baseURL}/mobile_apps/ios/`);
}
catch (e) {
}
ios_apps.value = response.data.value || [];
apps_loading.value = false;
}

reloadIosApps();

</script>
