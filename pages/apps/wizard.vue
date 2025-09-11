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
        <div class="text-caption">{{ $t('apps.note1') }}</div>
        <p class="text-caption">{{ $t('apps.note2') }}</p>
        <p class="text-caption">{{ $t('apps.note3') }}</p>
      </v-col>
    </v-row>

    <v-form @submit.prevent="onAppSubmit" :disabled="formBusy">
      <v-row>
        <v-col md="12">
          <div class="text-h5">{{ $t('apps.app_name') }}</div>
        </v-col>
        <v-col md="12">
          <v-text-field v-model="title.value.value" type="text" :error-messages="title.errorMessage.value"
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
          <v-radio-group v-model="platform" @change="platformChanged()">
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
          <div class="text-caption mt-2">{{ $t('apps.publishing.description') }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-radio-group v-model="publication_type.value.value" name="publication_type">
            <v-radio value="0">
              <template #label>
                <div>
                  {{ $t('apps.publishing.sc') }}
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="1">
              <template #label>
                <div>
                  {{ $t('apps.publishing.other') }}
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="2" v-if="isAndroid()">
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
          <div class="text-caption mt-2">{{ $t('apps.copyright.description') }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-radio-group v-model="copyright_type.value.value" name="copyright_type">
            <v-radio value="0">
              <template #label>
                <div>
                  {{ $t('apps.copyright.sc') }}
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="1">
              <template #label>
                <div>
                  {{ $t('apps.copyright.whitelabel') }}
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="2">
              <template #label>
                <div>
                  {{ $t('apps.copyright.custom') }}
                </div>
              </template>
            </v-radio>

          </v-radio-group>

          <v-text-field v-if="copyright_type.value.value == '2'" v-model="copyright_title.value.value" type="text"
            :error-messages="copyright_title.errorMessage.value" name="copyright_title"
            :hint="$t('apps.copyright.text_hint')" persistent-hint
            :label="$t('apps.copyright.text_label')"></v-text-field>

          <v-text-field v-if="copyright_type.value.value == '2'" v-model="copyright_url.value.value" type="url"
            :error-messages="copyright_url.errorMessage.value" name="copyright_url" :hint="$t('apps.copyright.link_hint')"
            persistent-hint :label="$t('apps.copyright.link_label')"></v-text-field>

        </v-col>
      </v-row>

      <!-- Price -->
      <v-row>
        <v-col md="12">
          <div class="text-h5">{{ $t('apps.price') }}: {{ appPrice }} {{ $t('currency') }}</div>
          <div class="text-caption mt-2">{{ $t('apps.price_description') }}</div>
          <div class="text-caption mt-2 font-weight-bold" v-if="isAndroid()">{{ $t('apps.free_5_days') }}</div>
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
  <v-snackbar v-model="notifyRadioCreated" color="accent">
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
const config = useRuntimeConfig();
const { locale, t } = useI18n();

const platform = ref('1');
let notifyRadioCreated = ref(false);
let notifyRadioFailed = ref(false);


// Form
const { handleSubmit, isSubmitting: formBusy, setErrors, errorBag } = useForm();

const title = useField('title', "required|max:30");
const copyright_type = useField('copyright_type', "required");
const copyright_title = useField('copyright_title');
const copyright_url = useField('copyright_url', 'url');
const publication_type = useField('publication_type', "required");
const comment = useField('comment');

// Initial values
copyright_type.value.value = "0";
publication_type.value.value = "0";

function isAndroid() {
  return platform.value == '1';
}

function isIos() {
  return platform.value == '2';
}


function platformChanged() {
  publication_type.value.value = "0";
}

const appPrice = computed(() => {
  let baseIosPrice;
  let baseAndroidPrice;
  let price = 0;

  if (locale.value == 'ru') {
    baseIosPrice = 21000;
    baseAndroidPrice = 17000;
  }
  else {
    baseIosPrice = 300;
    baseAndroidPrice = 250;
  }

  if (isAndroid()) {
    price += baseAndroidPrice;
    if (publication_type.value.value != '2') {
      if (locale.value == 'ru') {
        price += 3000;
      }
      else {
        price += 40;
      }
    }
  }
  else {
    price += baseIosPrice;
  }
  if (copyright_type.value.value != '0') {
    if (locale.value == 'ru') {
      price += 2500;
    }
    else {
      price += 40;
    }
  }
  return price;
})

async function appCreationRequest(values) {
  const platform = isAndroid() ? "android" : "ios";
  return await fetchAuth(`${config.public.baseURL}/mobile_apps/${platform}/`, {
    method: 'POST',
    body: values
  });
}

const onAppSubmit = handleSubmit(async values => {

  values.user = stateUser.user.id;
  values.email = stateUser.user.email;
  values.copyright_type = parseInt(values.copyright_type);
  values.publication_type = parseInt(values.publication_type);

  const platform = isAndroid() ? "android" : "ios";

  let response;

  try {
    response = await appCreationRequest(values);
  }
  catch (e) {
    if (typeof e == 'object') {
      const errorData = e.data;
      for (const [field, errors] of Object.entries(errorData)) {
        for (const errCode of errors) {
          setErrors({ [field]: t(`apps.errors.${field}.${errCode}`) })
        }
      }
    }
    return;
  }
  router.push(`/apps/${platform}/${response.id}`);
});


</script>
