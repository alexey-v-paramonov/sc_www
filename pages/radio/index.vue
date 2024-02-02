<template>
  <v-container>
    <!-- SELF Hosted list -->
    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h5">{{ $t('radios.self_hosted.title') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('radios.self_hosted.server') }}
              </th>
              <!-- <th class="text-left">
                {{ $t('radios.self_hosted.radios_num') }}
              </th> -->
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="self_hosted_radios.length > 0" v-for="item in self_hosted_radios" :key="item.id">
              <td>{{ item.ip }}</td>
              <!-- <td>{{ item.radios_num }}</td> -->
              <td><v-btn icon="mdi-delete" @click="deleteRadio(item)" :disabled="item.beingDeleted"></v-btn></td>
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
              <th class="text-left">
                {{ $t('radios.self_hosted.status') }}
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="hosted_radios.length > 0" v-for="item in hosted_radios" :key="item.name">
              <td>{{ item.login }}</td>
              <td>
                <v-chip v-if="item.status == 0 || item.status == 3" variant="flat" color="green">{{ $t('hosted.status.being_created') }}</v-chip>
                <v-chip v-if="item.status == 2" variant="flat" color="primary">{{ $t('hosted.status.running') }}</v-chip>
                <v-chip v-if="item.status == 4" variant="flat" color="primary">{{ $t('hosted.status.being_deleted') }}</v-chip>
                <v-chip v-if="item.status == 5" variant="flat" color="red">{{ $t('hosted.status.suspended') }}</v-chip>
                <v-chip v-if="item.status == 6" variant="flat" color="red">{{ $t('hosted.status.error') }}</v-chip>
              </td>
              <td><v-btn icon="mdi-delete" @click="deleteRadio(item)" :disabled="item.beingDeleted"></v-btn></td>
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
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-text>
        <div class="py-12 text-center">
          <v-icon class="mb-6" color="error" icon="mdi-alert-decagram" size="128"></v-icon>

          <div class="text-h4 font-weight-bold">{{ $t('radios.delete_confirmation') }}</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey" @click="answerDialog(false)">{{ $t('cancel') }}</v-btn>
        <v-btn variant="outlined" color="primary" @click="answerDialog(true)">{{ $t('delete') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="deleteRadioFailed" color="error">
    {{ $t('radios.delete_failed') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteRadioFailed = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="deleteRadioSuccess" color="success">
    {{ $t('radios.delete_success') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteRadioSuccess = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>
  
<script setup>
import { ref } from 'vue';

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
let dialog = ref(false);
let deleteRadioFailed = ref(false);
let deleteRadioSuccess = ref(false);
let answerDialog = ref();


function deleteRadio(radio) {
  dialog.value = true;
  new Promise((resolve) => {
    answerDialog = resolve;
  }).then((res) => {
    dialog.value = false;
    if(res){
      clearNuxtData();
      radio.beingDeleted = true;

      const isSelfHosted = Boolean(radio.ip);
      useFetchAuth(`${config.public.baseURL}/${ isSelfHosted? 'self_hosted_radio': 'hosted_radio'}/${radio.id}/`, { method: 'DELETE' }).then(
        (response) => {
          const data = response.data.value;
          const error = response.error.value;
          if (error) {
            deleteRadioFailed.value = true;
            console.log("Error", error);
          }
          else {
            deleteRadioSuccess.value = true;
            console.log("OK", response);
            isSelfHosted ? reloadSelfHostedRadios() : reloadHostedRadios();        
          }
        },
        (error) => {
          console.log("failed");
          deleteRadioFailed.value = true;
        }
      ).finally(() => {
        radio.beingDeleted = false;
      });
    }
  })
}

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
    console.log("Error: ", e);
  }
  hosted_radios.value = response.data.value || [];
  hosted_radios_loading.value = false;
}

reloadSelfHostedRadios();
reloadHostedRadios();


</script>

