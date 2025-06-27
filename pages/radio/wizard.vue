<template>
  <v-container>
    <v-row>
      <v-col md="12">
        <div class="text-h5">{{ $t('service_type') }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form @submit.prevent="onRadioSubmit" :disabled="formBusy">

          <v-radio-group v-model="hosting_type">
            <v-radio off-icon="mdi-radiobox-blank"
                     on-icon="mdi-radiobox-marked" value="1">
              <template #label>
                <div>
                  {{ $t('self_hosted.title') }}

                  <div class="text-caption">{{ $t('self_hosted.help') }}</div>
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="2" :disabled="locale == 'ru'">
              <template #label>
                <div>
                  {{ $t('hosted.title') }}
                  <div class="text-caption">{{ $t('hosted.help') }} </div>
                  <div v-if="locale == 'ru'" class="text-caption" style="color: red; font-weight: bold;">Временно не предоставляется</div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <!-- Self hosted form -->
          <template v-if="isSelfHosted()">
            <v-row>
              <v-col md="12">
                <v-alert type="info">
                {{ $t('self_hosted.description') }}
                <br />
                {{ $t('self_hosted.supported_os') }}
                <br />
                {{ $t('self_hosted.minimal_requirements') }}
                <br />
                {{ $t('self_hosted.supported_arch') }}
                </v-alert>
              </v-col>
            </v-row>

            <v-row v-if="locale == 'ru'">
              <v-col md="12">
                <b>Где арендовать сервер под радио: </b> <a href="https://radio-tochka.com/content/howto/radio_vps_firstvds" target="_blank">пример аренды сервера у провайдера FirstVDS</a> (Вы можете выбрать любой другой провайдер)
              </v-col>
            </v-row>

            <v-row>
              <v-col md="12">
                <v-checkbox v-model="is_unbranded.value.value" 
                  :label="$t('self_hosted.is_unbranded')" type="checkbox"
                  :hint="$t('self_hosted.is_unbranded_hint')" persistent-hint></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2" md="1"><strong>{{ $t('service_price') }}:</strong></v-col>
              <v-col cols="10" md="11">
                <template v-if="locale == 'en'">
                  <b>{{selfHostedPrice}}$ per month</b> if you have up to 5 radio stations.<br /> Each additional station costs $1, so if
                  your server is running 10 stations the price is: {{selfHostedPrice}}$ + 5*1$ = {{selfHostedPrice + 5}}$ per month.
                </template>

                <template v-else>
                  <b>{{selfHostedPrice}} рублей</b> в месяц, включено до 5 станций.<br /> Каждая дополнительная станция - дополнительно 80
                  рублей. Если, например, всего станций 8 - то стоимость составит {{selfHostedPrice}} + 3 * 80 = {{selfHostedPrice + 240}} рублей в месяц.
                </template>

              </v-col>
            </v-row>

            <v-row>
              <v-col md="12">
                <v-text-field v-model="ip.value.value" type="text" :error-messages="ip.errorMessage.value"
                  :hint="$t('self_hosted.ip_hint')" persistent-hint :label="$t('self_hosted.ip')"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="12">
                <v-checkbox v-model="install_myself.value.value" :error-messages="install_myself.errorMessage.value"
                  value="1" :label="$t('self_hosted.include_installation')" type="checkbox"
                  :hint="$t('self_hosted.include_installation_hint')" persistent-hint></v-checkbox>
              </v-col>
            </v-row>

            <v-row v-if="install_myself.value.value == '1'">
              <v-col md="12">
                <v-text-field v-model="domain.value.value" type="text" :error-messages="domain.errorMessage.value"
                  :label="$t('self_hosted.server_domain')" :hint="$t('self_hosted.server_domain_hint')"
                  persistent-hint></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="install_myself.value.value == '1'">
              <v-col md="12">
                <v-text-field v-model="ssh_username.value.value" type="text"
                  :error-messages="ssh_username.errorMessage.value" :label="$t('self_hosted.root_username')"
                  :hint="$t('self_hosted.root_username_hint')" persistent-hint></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="install_myself.value.value == '1'">
              <v-col md="12">
                <v-text-field v-model="ssh_password.value.value" type="text"
                  :error-messages="ssh_password.errorMessage.value" :label="$t('self_hosted.root_password')"
                  :hint="$t('self_hosted.root_password_hint')" persistent-hint></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="install_myself.value.value == '1'">
              <v-col md="12">
                <v-text-field v-model="ssh_port.value.value" type="text" :error-messages="ssh_port.errorMessage.value"
                  :label="$t('self_hosted.server_port')"></v-text-field>
              </v-col>
            </v-row>


            <v-row v-if="install_myself.value.value != '1'">
              <v-col md="12">
                {{ $t('self_hosted.install_command') }}:<br />
                <b>bash &lt;(wget -qO- https://streaming.center/dist/install.sh)</b>
                <br />
                <br />

                <p v-if="locale=='en'">
                  {{ $t('self_hosted.install_video') }}: <a href="https://youtu.be/E6Q3_xGWCQI" target="_blank"><u>{{ $t('watch_video') }}</u></a>
                </p>

                <p v-if="locale=='ru'">
                  {{ $t('self_hosted.install_video') }}: <a href="https://vkvideo.ru/video190379704_456239024" target="_blank"><u>{{ $t('watch_video') }}</u></a>
                </p>
              </v-col>
            </v-row>

          </template>


          <v-row v-if="isHosted()">
            <v-col md="12">
              <div class="text-h5 mb-4 mt-4">{{ $t('hosted.legal') }}</div>


              <v-radio-group v-model="legal_type.value.value">
                <v-radio value="1">
                  <template #label>
                    <div>
                      {{ $t('hosted.legal_1') }}

                      <div class="text-caption">{{ $t('hosted.legal_1_help') }}</div>
                    </div>
                  </template>
                </v-radio>
                <br />
                <v-radio value="2">
                  <template #label>
                    <div>
                      {{ $t('hosted.legal_2') }}
                      <div class="text-caption">{{ $t('hosted.legal_2_help') }}</div>
                    </div>
                  </template>
                </v-radio>
                <br />
                <v-radio value="3">
                  <template #label>
                    <div>
                      {{ $t('hosted.legal_3') }}
                      <div class="text-caption">{{ $t('hosted.legal_3_help') }}</div>
                    </div>
                  </template>
                </v-radio>

              </v-radio-group>

              <v-text-field v-model="login.value.value" type="text" :error-messages="login.errorMessage.value"
                name="login" :hint="$t('hosted.station_id_hint')" persistent-hint
                :label="$t('hosted.station_id')" maxlength="16"></v-text-field>

            </v-col>
          </v-row>

          <v-row v-if="isHosted() && login.value.value">
            <v-col md="12">
              <strong>{{ $t('hosted.station_url') }}:</strong>
              <blockquote class="blockquote">
                <p>
                  https://{{ login.value.value }}<template v-if="locale == 'en'">.streaming.center</template><template
                    v-else>.radio-tochka.com</template>
                </p>
              </blockquote>
              <v-alert type="info">
                <strong>{{ $t('self_hosted.username') }}:</strong> {{ login.value.value }}
                <br />
                <strong>{{ $t('password') }}:</strong> {{ $t('self_hosted.password_hint') }} {{stateUser.user.email}}
              </v-alert>

            </v-col>
          </v-row>



          <!-- Price section -->
          <template v-if="isHosted() && legal_type.value.value != '3'">
            <v-row>
              <v-col md="12">
                <div class="text-h5">{{ $t('service_price') }}</div>
                <p>{{ $t('service_price_free_period') }}</p>
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
              <v-col md="2" class="text-no-wrap">{{ price.price }} {{ $t('currency') }}</v-col>

              <v-col md="2">{{ $t('hosted.price_disk') }}:</v-col>
              <v-col md="2" class="text-no-wrap">{{ price.du_price }} {{ $t('currency') }}</v-col>

              <v-col md="2"><strong>{{ $t('hosted.price_total') }}:</strong></v-col>
              <v-col md="2" class="text-no-wrap">{{ price.price + price.du_price }} {{ $t('currency') }}/{{ $t('monthly') }} </v-col>

            </v-row>
          </template>

          <v-row>
            <v-col md="12">
              <v-textarea v-model="comment.value.value" :label="$t('self_hosted.comments')"></v-textarea>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="12">

              <v-btn type="submit" :disabled="formBusy" block class="mt-2" color="primary">{{ $t('self_hosted.submit')
              }}</v-btn>
            </v-col>
          </v-row>
        </v-form>


      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="notifyRadioCreated" color="success">
    {{ $t('radio_wizard.created') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="notifyRadioCreated = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="notifyRadioFailed" color="error">
    {{ $t('radio_wizard.failed') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="notifyRadioFailed = false">
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

import { ref, reactive, computed } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useUiStateStore } from '@/stores/ui'
import { useUserStore } from '~/stores/user'

const stateUI = useUiStateStore()
const stateUser = useUserStore()
const router = useRouter();

const { locale, t } = useI18n();
const hosting_type = ref('1');
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

// Self-hosted params
const ip = useField('ip', (value) => {
  if (isHosted()) {
    return true;
  }
  if (isSelfHosted() && !value) {
    return t("errors.required");
  }
  if (!/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(value)) {
    return t('errors.ip_invalid');
  }
  return true;
});
const is_unbranded = useField('is_unbranded');
const install_myself = useField('install_myself');
const ssh_username = useField('ssh_username', sshParamsValidation);
const ssh_password = useField('ssh_password', sshParamsValidation);
const ssh_port = useField('ssh_port', sshParamsValidation);

const domain = useField('domain');
const comment = useField('comment');

const selfHostedPrice = computed(() => {
    let price = 0;
    if(locale.value == 'en'){
      price = 10;
      if(is_unbranded.value.value){
        price += 5;
      }
    }
    else{
      price = 549;
      if(is_unbranded.value.value){
        price += 300;
      }
    }
    return price;
});

function sshParamsValidation(value) {
  if (!install_myself.value.value) {
    return true;
  }
  if (isSelfHosted() && !value) {
    return t("errors.required");
  }
  return true;
}

// Hosted params
const legal_type = useField('legal_type', "required");
const login = useField('login', value => {
  if (isSelfHosted()) {
    return true;
  }
  if (!value) {
    return t("errors.required");
  }
  if (!/^[a-zA-Z0-9]*$/.test(value)) {
    return t("errors.regex");;
  }
  return true;
});

ssh_username.value.value = "root";
ssh_port.value.value = "22";
is_unbranded.value.value = false;
install_myself.value.value = "1";
legal_type.value.value = "1";
const domain_name = ref('');
const ssh_root_pass = ref('');
const additional_notes = ref('');
// Hosted params
const username = ref('');
const config = useRuntimeConfig();

function isSelfHosted() {
  return hosting_type.value == '1';
}

function isHosted() {
  return hosting_type.value == '2';
}

async function priceRequest(data) {
  return await $fetch(`${config.public.baseURL}/pricing/`, {
    method: 'GET',
    params: {
      'bitrate': audio_bitrate.value,
      'listeners': audio_listeners.value,
      'disk_quota': disk_quota.value,
      'currency': locale.value == 'en' ? 0 : 1,
    }
  });
}

async function selfHostedRequest(values) {
  return await fetchAuth(`${config.public.baseURL}/self_hosted_radio/`, {
    method: 'POST',
    body: values
  });

}

async function hostedRequest(values) {
  return await fetchAuth(`${config.public.baseURL}/hosted_radio/`, {
    method: 'POST',
    body: {
      login: values.login,
      bitrate: audio_bitrate.value,
      listeners: legal_type.value.value == '3' ? 5 : audio_listeners.value,
      disk_quota: disk_quota.value,
      is_demo: legal_type.value.value == '3',
      copyright_type: legal_type.value.value,
      user: stateUser.user.id,
      initial_audio_format: audio_format.value,
      initial_bitrate: audio_bitrate.value,
      initial_listeners: legal_type.value.value == '3' ? 5 : audio_listeners.value,
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
  Object.assign(price, response)
  formBusy.value = false;
  stateUI.setLoading(false);

}

const onRadioSubmit = handleSubmit(async values => {
  values.user = stateUser.user.id;
  delete values.install_myself;
  delete values.legal_type;
  stateUI.setLoading(true);
  const request = isSelfHosted() ? selfHostedRequest : hostedRequest;

  try {
    const response = await request(values);
  }
  catch (e) {
    notifyRadioFailed.value = true;
    if (typeof e == 'object') {
      const errorData = e.data;
      for (const [field, errors] of Object.entries(errorData)) {
        for (const errCode of errors) {
          setErrors({ [field]: t(`radio_wizard.errors.${field}.${errCode}`) })
        }
      }
      if (errorData['non_field_errors'] == 'unique_login_server') {
        setErrors({ 'login': t(`radio_wizard.errors.login.unique`) })
      }

      if (errorData['is_demo'] == 'demo_exists') {
        setErrors({ 'login': t(`radio_wizard.errors.login.demo_exists`) })
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

if(locale.value != "ru"){
  calculatePrice();

}

</script>
