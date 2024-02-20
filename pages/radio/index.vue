<template>
  <v-container>

    <v-row no-gutters md="12">
      <v-col class="text-right">
        <v-btn prepend-icon="mdi-plus" to="/radio/wizard" color="primary">{{ $t('radio.wizard') }}</v-btn>
      </v-col>
    </v-row>

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
              <th class="text-left">
                {{ $t('self_hosted.server_domain') }}
              </th>
              <th class="text-left">
                {{ $t('service_price') }}
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="self_hosted_radios.length > 0 && !self_hosted_radios_loading" v-for="item in self_hosted_radios" :key="item.id">
              <td>{{ item.ip }}</td>
              <td>{{ item.domain }}</td>
              <td>{{ item.price }}{{ $t('currency')}}</td>
              <td>
                <NuxtLink :to="'/radio/self_hosted/' + item.id + '/'"><v-btn icon="mdi-pencil"></v-btn></NuxtLink>
                &nbsp;
                <v-btn icon="mdi-delete" @click="deleteRadio(item)" :disabled="item.beingDeleted"></v-btn>
              </td>
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
              <th class="text-left">
                {{ $t('service_price') }}
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="hosted_radios.length > 0 && !hosted_radios_loading" v-for="item in hosted_radios" :key="item.name">
              <td>{{ item.login }}</td>
              <td>
                <v-chip v-if="item.status == 0 || item.status == 3" variant="flat" color="green">{{ $t('hosted.status.being_created') }}</v-chip>
                <v-chip v-if="item.status == 2" variant="flat" color="primary">{{ $t('hosted.status.running') }}</v-chip>
                <v-chip v-if="item.status == 4" variant="flat" color="red">{{ $t('hosted.status.being_deleted') }}</v-chip>
                <v-chip v-if="item.status == 5" variant="flat" color="red">{{ $t('hosted.status.suspended') }}</v-chip>
                <v-chip v-if="item.status == 6" variant="flat" color="red">{{ $t('hosted.status.error') }}</v-chip>
              </td>
              <td>{{ item.price }}{{ $t('currency')}}</td>

              <td><v-btn v-if="[2, 5, 6].includes(item.status)" icon="mdi-delete" @click="deleteRadio(item)" :disabled="item.beingDeleted"></v-btn></td>
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

let dialog = ref(false);
let deleteRadioFailed = ref(false);
let deleteRadioSuccess = ref(false);
let answerDialog = ref();

const { data: self_hosted_radios, pending: self_hosted_radios_loading, refresh: reloadSelfHostedRadios } = await useFetchAuth(`${config.public.baseURL}/self_hosted_radio/`);
const { data: hosted_radios, pending: hosted_radios_loading, refresh: reloadHostedRadios } = await useFetchAuth(`${config.public.baseURL}/hosted_radio/`);

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
      fetchAuth(`${config.public.baseURL}/${ isSelfHosted? 'self_hosted_radio': 'hosted_radio'}/${radio.id}/`, { method: 'DELETE' }).then(
        (r) => {
            deleteRadioSuccess.value = true;
            isSelfHosted ? reloadSelfHostedRadios() : reloadHostedRadios();        
        },
        (e) => {
          deleteRadioFailed.value = true;
        }
      ).finally(() => {
        radio.beingDeleted = false;
      });
    }
  })
}

</script>

