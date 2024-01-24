<template>
  <v-container>

    <v-row>
      <v-col md="12">
        <div class="text-h5">{{ $t('apps.title') }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <div class="text-caption">{{ $t('apps.description') }}</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="12">
        <div class="text-h5">{{ $t('apps.app_name') }}</div>
      </v-col>
      <v-col md="12">
        <v-text-field v-model="app_name.value.value" type="text" :error-messages="app_name.errorMessage.value"
          :hint="$t('apps.app_name_hint')" persistent-hint :label="$t('apps.app_name')" maxlength="30"></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="12">
        <div class="text-h5">{{ $t('apps.platform') }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form @submit.prevent="onAppSubmit" :disabled="formBusy">

          <v-radio-group v-model="platform">
            <v-radio value="1">
              <template #label>
                <div>
                  {{ $t('nav_android') }}

                  <div class="text-caption">{{ $t('apps.android.help') }}</div>
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="2">
              <template #label>
                <div>
                  {{ $t('nav_ios') }}
                  <div class="text-caption">{{ $t('apps.ios.help') }}</div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>



          <v-row >
            <v-col md="12">
              <div class="text-h5">{{ $t('apps.copyright.title') }}</div>
              <div class="text-caption">{{ $t('apps.copyright.description') }}</div>


              <v-radio-group v-model="copyright_type.value.value">
                <v-radio value="1">
                  <template #label>
                    <div>
                      {{ $t('apps.copyright.sc') }}
                    </div>
                  </template>
                </v-radio>
                <br />
                <v-radio value="2">
                  <template #label>
                    <div>
                      {{ $t('apps.copyright.whitelabel') }}
                    </div>
                  </template>
                </v-radio>
                <br />
                <v-radio value="3">
                  <template #label>
                    <div>
                      {{ $t('apps.copyright.custom') }}
                    </div>
                  </template>
                </v-radio>

              </v-radio-group>

              <v-text-field v-if="copyright_type.value.value == '3'" v-model="copyright_text.value.value" type="text" :error-messages="copyright_text.errorMessage.value" name="copyright_text"
                :hint="$t('apps.copyright.text_hint')" persistent-hint :label="$t('apps.copyright.text_label')"></v-text-field>

              <v-text-field v-if="copyright_type.value.value == '3'" v-model="copyright_link.value.value" type="text" :error-messages="copyright_link.errorMessage.value" name="copyright_link"
                :hint="$t('apps.copyright.link_hint')" persistent-hint :label="$t('apps.copyright.link_label')"></v-text-field>

            </v-col>
          </v-row>


          <!-- Price section -->
          <v-tempplate v-if="isHosted() && legal_type.value.value != '3'">
            <v-row>
              <v-col md="12">
                <div class="text-h5">{{ $t('service_price') }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="6">
                <v-select :label="$t('hosted.audio_format')" v-model="audio_format" :items="AUDIO_FORMATS"
                  @update:modelValue="calculatePrice()"></v-select>
              </v-col>

              <v-col md="6" v-if="audio_format != 'flac'">
                <v-select :label="$t('hosted.audio_bitrate')" v-model="audio_bitrate"
                  :items="audio_format == 'mp3' ? BITRATES_MP3 : BITRATES_AAC_PLUS_PLUS"
                  @update:modelValue="calculatePrice()"></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="6">
                <v-select :label="$t('hosted.audio_listeners')" v-model="audio_listeners" :items="LISTENERS"
                  @update:modelValue="calculatePrice()"></v-select>
              </v-col>
              <v-col md="6">
                <v-select :label="$t('hosted.disk_quota')" v-model="disk_quota" :items="DISK_QUOTAS"
                  @update:modelValue="calculatePrice()"></v-select>
              </v-col>
            </v-row>

            <v-row v-if="price.price !== null && price.du_price !== null">
              <v-col md="2">{{ $t('hosted.price_stream') }}:</v-col>
              <v-col md="2">{{ price.price }} {{ $t('currency') }}</v-col>

              <v-col md="2">{{ $t('hosted.price_disk') }}:</v-col>
              <v-col md="2">{{ price.du_price }} {{ $t('currency') }}</v-col>

              <v-col md="2"><strong>{{ $t('hosted.price_total') }}:</strong></v-col>
              <v-col md="2">{{ price.price + price.du_price }} {{ $t('currency') }}</v-col>

            </v-row>
          </v-tempplate>

          <v-row>
            <v-col md="12">
              <v-textarea v-model="comment.value.value" :label="$t('self_hosted.comments')"></v-textarea>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col md="12">

              <v-btn type="submit" :disabled="formBusy" block class="mt-2" color="primary" >{{ $t('self_hosted.submit') }}</v-btn>
            </v-col>
          </v-row>
        </v-form>


      </v-col>
    </v-row>
  </v-container>
  <v-snackbar
      v-model="notifyRadioCreated"
      color="success"
    >
      {{ $t('radio_wizard.created') }}

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="notifyRadioCreated = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
  </v-snackbar>  

  <v-snackbar
      v-model="notifyRadioFailed"
      color="error"
    >
      {{ $t('radio_wizard.failed') }}

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="notifyRadioFailed = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
  </v-snackbar>  

</template>
  
<script setup>

definePageMeta({
  layout: "default",
  middleware: 'auth',
});

import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useUiStateStore } from '@/stores/ui'
import { useUserStore } from '~/stores/user'

const stateUI = useUiStateStore()
const stateUser = useUserStore()
const router = useRouter();

const { locale, t } = useI18n();
const platform = ref('1');
const audio_format = ref('mp3');
const audio_bitrate = ref(128);
const audio_listeners = ref(50);
const disk_quota = ref(5);
let price = reactive({ price: null, du_price: null })
let notifyRadioCreated = ref(false);
let notifyRadioFailed = ref(false);

const AUDIO_FORMATS = [{ "value": "mp3", "title": 'MP3' }, { "value": "aac++", "title": 'AAC++' }, { "value": "flac", "title": 'FLAC' }];
const BITRATES_MP3 = [16, 24, 32, 64, 96, 128, 160, 192, 256, 320];
const BITRATES_AAC_PLUS_PLUS = [16, 24, 32, 64];
const LISTENERS = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000];
const DISK_QUOTAS = [5, 6, 7, 9, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200];

// Form
const { handleSubmit, isSubmitting: formBusy, setErrors, errorBag } = useForm();

const app_name = useField('app_name', "required|max:30");

const install_myself = useField('install_myself');
const copyright_text = useField('copyright_text');
const copyright_link = useField('copyright_link', 'url');

const domain = useField('domain');
const comment = useField('comment');


// Hosted params 
const copyright_type = useField('copyright_type', "required");
const login = useField('login', value => {
  if(isSelfHosted()){
    return true;
  }
  if(!value){
    return t("errors.required");
  }
  if(!/[a-z0-9A-Z]+$/.test(value)){
    return t("errors.regex");;
  }
  return true;
});

copyright_type.value.value = "1";

const additional_notes = ref('');
// Hosted params
const username = ref('');
const config = useRuntimeConfig();

function isSelfHosted() {
  return platform.value == '1';
}

function isHosted() {
  return platform.value == '2';
}

async function priceRequest(data) {
  return await useFetch(`${config.public.baseURL}/pricing/`, {
    method: 'GET',
    params: {
      'bitrate': audio_bitrate.value,
      'listeners': audio_listeners.value,
      'disk_quota': disk_quota.value,
    }
  });
}

async function selfHostedRequest(values) {
  return await useFetchAuth(`${config.public.baseURL}/self_hosted_radio/`, {
      method: 'POST',
      body: values
  });

}

async function hostedRequest(values) {
  return await useFetchAuth(`${config.public.baseURL}/hosted_radio/`, {
      method: 'POST',
      body: {
        login: values.login,
        bitrate: audio_bitrate.value,
        listeners: audio_listeners.value,
        disk_quota: disk_quota.value,
        is_demo: legal_type.value.value == '3',
        user: stateUser.user.id,
        initial_audio_format: audio_format.value,
        initial_bitrate: audio_bitrate.value,
        initial_listeners: audio_listeners.value,
        initial_du: disk_quota.value,
        comment: comment.value.value
      }
  });
}

async function calculatePrice() {
  if (audio_format.value == 'aac++' && audio_bitrate.value > BITRATES_AAC_PLUS_PLUS[BITRATES_AAC_PLUS_PLUS.length - 1]) {
    audio_bitrate.value = BITRATES_AAC_PLUS_PLUS[BITRATES_AAC_PLUS_PLUS.length - 1];
  }
  formBusy.value = true;
  stateUI.setLoading(true);
  const response = await priceRequest();
  Object.assign(price, response.data.value)
  formBusy.value = false;
  stateUI.setLoading(false);

}

const onAppSubmit = handleSubmit(async values => {
  values.user = stateUser.user.id;
  delete values.install_myself;
  delete values.legal_type;
  stateUI.setLoading(true);
  const request = isSelfHosted() ? selfHostedRequest : hostedRequest;

  try{
    const response = await request(values);
    console.log(response);
  }
  catch(e){
    notifyRadioFailed.value = true;
    const errorData = e.data;
    for (const [field, errors] of Object.entries(errorData)) {
      for(const errCode of errors){
        setErrors({ [field]: t(`radio_wizard.errors.${field}.${errCode}`) })
      }      
    }
    
    return;
  }
  finally {
    stateUI.setLoading(false);
  }
  // Notify
  notifyRadioCreated.value = true;
  router.push("/radio");
});


calculatePrice();

</script>
