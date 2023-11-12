<template>
  <v-container>
    <!-- SELF Hosted list -->
    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h5">{{ $t('radios.self_hosted.title') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col><v-btn icon="mdi-delete"></v-btn>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('radios.self_hosted.server') }}
              </th>
              <th class="text-left">
                {{ $t('radios.self_hosted.radios_num') }}
              </th>
              <th class="text-left">
                {{ $t('radios.self_hosted.status') }}
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="self_hosted_radios.length > 0" v-for="item in self_hosted_radios" :key="item.id">
              <td>{{ item.ip }}</td>
              <td>{{ item.radios_num }}</td>
              <td>{{ item.status }}</td>
              <td><v-btn icon="mdi-delete"  @click="deleteSelfHosted(item)"></v-btn></td>
            </tr>
            <tr v-else-if="self_hosted_radios_loading">
              <td colspan="10" class="text-center"><v-progress-circular indeterminate></v-progress-circular></td>
            </tr>

            <tr v-else>
              <td class="text-center" colspan="3">
                <br />
                {{ $t('radios.self_hosted.empty') }}
                <br />
                <br />
                <v-btn color="primary" to="/radio/wizard" class="mt-2">{{ $t('radio.wizard') }}</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

    </v-row>
    
    <v-row>
      <v-col cols="12">
        <div class="pt-5 pb-5">
          <v-divider></v-divider>
        </div>
      </v-col>
    </v-row>
    

    <!-- Hosted list -->
    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h5">{{ $t('radios.hosted.title') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('hosted.station_id') }}
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="self_hosted_radios.length > 0"  v-for="item in hosted_radios" :key="item.name">
              <td>{{ item.login }}</td>
              <td><v-btn icon="mdi-delete" @click="deleteHosted(item)"></v-btn></td>
            </tr>
            <tr v-else-if="hosted_radios_loading">
              <td colspan="10" class="text-center"><v-progress-circular indeterminate></v-progress-circular></td>
            </tr>

            <tr v-else>
              <td class="text-center" colspan="3">
                <br />
                {{ $t('radios.hosted.empty') }}
                <br />
                <br />
                <v-btn color="primary" to="/radio/wizard" class="mt-2">{{ $t('radio.wizard') }}</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

    </v-row>

</v-container>
</template>
  
<script setup>
import { ref, reactive } from 'vue';

import { useUiStateStore } from '@/stores/ui'

definePageMeta({
  layout: "default",
});
const config = useRuntimeConfig();
const stateUI = useUiStateStore()
let self_hosted_radios = ref([]);
let hosted_radios = ref([]);
let self_hosted_radios_loading = ref(false);
let hosted_radios_loading = ref(false);

function deleteSelfHosted(radio){
  console.log("Delete self hosted: ", radio)
}

function deleteHosted(radio){
  console.log("Delete hosted: ", radio)
}

async function reloadSelfHostedRadios() {
  let response;
  self_hosted_radios_loading = true;
  try{
    response = await useFetchAuth(`${config.public.baseURL}/self_hosted_radio/`);
  }
  catch(e){
  }
  self_hosted_radios.value = response.data.value || [];
  self_hosted_radios_loading = false;
}

async function reloadHostedRadios() {
  let response;
  hosted_radios_loading = true;
  try{
    response = await useFetchAuth(`${config.public.baseURL}/hosted_radio/`);
  }
  catch(e){
  }
  hosted_radios.value = response.data.value || [];
  hosted_radios_loading = false;
}

reloadSelfHostedRadios();
reloadHostedRadios();


</script>
