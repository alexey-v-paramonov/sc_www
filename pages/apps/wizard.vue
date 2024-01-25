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

    <v-form @submit.prevent="onAppSubmit" :disabled="formBusy">
      <v-row>

        <v-col md="12">
          <div class="text-h5">{{ $t('apps.app_name') }}</div>
        </v-col>
        <v-col md="12">
          <v-text-field v-model="app_name.value.value" type="text" :error-messages="app_name.errorMessage.value"
            :hint="$t('apps.app_name_hint')" persistent-hint :label="$t('apps.app_name')" maxlength="30"></v-text-field>
        </v-col>
      </v-row>

      <!-- Platform -->
      <v-row>
        <v-col md="12">
          <div class="text-h5">{{ $t('apps.platform') }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
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
        </v-col>
      </v-row>


      <!-- Publishing settings -->
      <v-row>
        <v-col md="12">
          <div class="text-h5">{{ $t('apps.publishing.title') }}</div>
          <div class="text-caption">{{ $t('apps.publishing.description') }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-radio-group v-model="publishing_type.value.value" name="publishing_type">
            <v-radio value="1">
              <template #label>
                <div>
                  {{ $t('apps.publishing.sc') }}
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="2">
              <template #label>
                <div>
                  {{ $t('apps.publishing.other') }}
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="3" v-if="isAndroid()">
              <template #label>
                <div>
                  {{ $t('apps.publishing.no') }}
                </div>
              </template>
            </v-radio>

          </v-radio-group>

        </v-col>
      </v-row>

      <!-- Copyright settings -->
      <v-row>
        <v-col md="12">
          <div class="text-h5">{{ $t('apps.copyright.title') }}</div>
          <div class="text-caption">{{ $t('apps.copyright.description') }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-radio-group v-model="copyright_type.value.value" name="copyright_type">
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

          <v-text-field v-if="copyright_type.value.value == '3'" v-model="copyright_text.value.value" type="text"
            :error-messages="copyright_text.errorMessage.value" name="copyright_text"
            :hint="$t('apps.copyright.text_hint')" persistent-hint
            :label="$t('apps.copyright.text_label')"></v-text-field>

          <v-text-field v-if="copyright_type.value.value == '3'" v-model="copyright_link.value.value" type="text"
            :error-messages="copyright_link.errorMessage.value" name="copyright_link"
            :hint="$t('apps.copyright.link_hint')" persistent-hint
            :label="$t('apps.copyright.link_label')"></v-text-field>

        </v-col>
      </v-row>

      <!-- Price -->
      <v-row>
        <v-col md="12">
          <div class="text-h5">{{ $t('apps.price') }}: {{ appPrice }} {{ $t('currency') }}</div>
          <div class="text-caption">{{ $t('apps.price_description') }}</div>
        </v-col>
      </v-row>


      <v-row>
        <v-col md="12">
          <v-textarea v-model="comment.value.value" :label="$t('apps.comments')"></v-textarea>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col md="12">

          <v-btn type="submit" :disabled="formBusy" block class="mt-2" color="primary">{{ $t('apps.submit') }}</v-btn>
        </v-col>
      </v-row>

    </v-form>
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
import { ref, reactive, computed } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useUiStateStore } from '@/stores/ui'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: "default",
  middleware: 'auth',
});

const stateUI = useUiStateStore()
const stateUser = useUserStore()
const router = useRouter();

const { locale, t } = useI18n();
const platform = ref('1');

let price = reactive({ price: null, du_price: null })
let notifyRadioCreated = ref(false);
let notifyRadioFailed = ref(false);

const appPrice = computed(() => {
  let baseIosPrice;
  let baseAndroidPrice;
  let price = 0;

  if (locale == 'ru') {
    baseIosPrice = 18000;
    baseAndroidPrice = 14500;
  }
  else {
    baseIosPrice = 300;
    baseAndroidPrice = 250;
  }

  if (isAndroid()) {
    price += baseAndroidPrice;
    if (publishing_type.value.value != '3') {
      if (locale == 'ru') {
        price += 2000;
      }
      else {
        price += 30;
      }
    }
  }
  else {
    price += baseIosPrice;
  }
  if (copyright_type.value.value != '1') {
    if (locale == 'ru') {
      price += 2000;
    }
    else {
      price += 30;
    }
  }



  return price;
})


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
const publishing_type = useField('publishing_type', "required");

copyright_type.value.value = "1";
publishing_type.value.value = "1";

const additional_notes = ref('');
// Hosted params
const username = ref('');
const config = useRuntimeConfig();

function isAndroid() {
  return platform.value == '1';
}

function isIos() {
  return platform.value == '2';
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

      initial_bitrate: audio_bitrate.value,
      initial_listeners: audio_listeners.value,
      initial_du: disk_quota.value,
      comment: comment.value.value
    }
  });
}


const onAppSubmit = handleSubmit(async values => {
  values.user = stateUser.user.id;
  delete values.install_myself;
  delete values.legal_type;
  stateUI.setLoading(true);
  // //const request = isSelfHosted() ? selfHostedRequest : hostedRequest;

  // try {
  //   const response = await request(values);
  //   console.log(response);
  // }
  // catch (e) {
  //   notifyRadioFailed.value = true;
  //   const errorData = e.data;
  //   for (const [field, errors] of Object.entries(errorData)) {
  //     for (const errCode of errors) {
  //       setErrors({ [field]: t(`radio_wizard.errors.${field}.${errCode}`) })
  //     }
  //   }

  //   return;
  // }
  // finally {
  //   stateUI.setLoading(false);
  // }
  // // Notify
  // notifyRadioCreated.value = true;
  router.push("/radio");
});


</script>
