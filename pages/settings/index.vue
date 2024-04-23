<template>
  <v-container>
    <v-row md="12">
      <v-col>
        <div class="text-h5">{{ $t('settings.title') }}</div>
      </v-col>
    </v-row>
    <v-row md="12">
      <v-col md="12">
        <v-form @submit.prevent="onSettingsSubmit" :disabled="isSettingsSubmitting">
          <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
            :label="$t('email')"></v-text-field>

          <v-text-field autocomplete="one-time-code" v-model="password.value.value"
            :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'"
            name="password" :label="$t('password')" :hint="$t('password_reset.new_pass')" counter
            :error-messages="password.errorMessage.value" @click:append="showPass = !showPass">
          </v-text-field>

          <v-checkbox v-model="subscribed.value.value" :label="$t('settings.subscribed')" type="checkbox"></v-checkbox>


          <v-btn type="submit" :disabled="isSettingsSubmitting" block class="mt-2" color="primary">{{
            isSettingsSubmitting ? $t('loading') : $t('save') }}</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-spacer>&nbsp;</v-spacer>
    <v-spacer>&nbsp;</v-spacer>
    <v-spacer>&nbsp;</v-spacer>
    <v-row md="12">
      <v-col>
        <div class="text-h5">{{ $t('settings.delete_account_title') }}</div>
        <p>{{ $t('settings.delete_account_title_text') }}</p>
      </v-col>
    </v-row>
    <v-row md="12">
      <v-col md="12">
        <v-btn :disabled="isRemovalRequestRunning || stateUser.user.userData.balance != 0" block class="mt-2"
          color="error" @click="sendRemovalRequest()">{{
            isRemovalRequestRunning ? $t('loading') : $t('settings.delete_account_cta') }}</v-btn>
      </v-col>
    </v-row>

  </v-container>
  <v-snackbar v-model="settingsSaveSuccess" color="success">
    {{ $t('settings.save_success') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="settingsSaveSuccess = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="deleteRequestFailed" color="error">
    {{ $t('settings.delete_account_request_failed') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteRequestFailed = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>


  <v-snackbar v-model="deleteRequestSuccess" color="success">
    {{ $t('settings.delete_account_request_success') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteRequestSuccess = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>

</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js';
import { useUiStateStore } from '@/stores/ui'

const stateUser = useUserStore()
const { t } = useI18n();

const stateUI = useUiStateStore()
const showPass = ref(false);
const settingsSaveSuccess = ref(false);
const isRemovalRequestRunning = ref(false);
const config = useRuntimeConfig();
let deleteRequestSuccess = ref(false);
let deleteRequestFailed = ref(false);

definePageMeta({
  layout: "default",
});
await stateUser.getUserData();

const { handleSubmit, isSubmitting: isSettingsSubmitting, setErrors } = useForm({
  initialValues: {
    email: stateUser.user.email,
    password: '',
    subscribed: stateUser.user.userData.subscribed,
  }
});

const email = useField('email', "required|email");
const password = useField('password', "min:8");
const subscribed = useField('subscribed');

async function saveSettingsRequest(data) {

  const config = useRuntimeConfig();
  let payload = {
    'email': data.email,
    'subscribed': data.subscribed
  };
  if (data.password) {
    payload.password = data.password;
  }

  return await fetchAuth(`${config.public.baseURL}/users/${stateUser.user.id}/profile/`, {
    method: 'PUT',
    body: payload
  });
}


const onSettingsSubmit = handleSubmit(async values => {
  const somethingHasChanged = values.password || values.email != stateUser.user.email || subscribed.value.value != stateUser.user.userData.subscribed;
  if (!somethingHasChanged) {
    return;
  }

  let response;
  try {
    response = await saveSettingsRequest(values);
  }
  catch (e) {
    const errorData = e.data;
    if (typeof errorData == 'object') {
      for (const [field, errors] of Object.entries(errorData)) {
        for (const errCode of errors) {
          setErrors({ [field]: t(`settings.errors.${field}.${errCode}`) })
        }
      }
    }
    return;

  }
  stateUser.setUserEmail(values.email);
  settingsSaveSuccess.value = true;
  stateUser.user.userData.subscribed = subscribed.value.value;
});

function sendRemovalRequest(app) {
  isRemovalRequestRunning.value = true;

  fetchAuth(`${config.public.baseURL}/users/${stateUser.user.id}/request_account_deletion/`, { method: 'POST' }).then(
    (r) => {
      deleteRequestSuccess.value = true;
    },
    (e) => {
      deleteRequestFailed.value = true;
    }
  ).finally(() => {
    isRemovalRequestRunning.value = false;
  });
}

</script>
