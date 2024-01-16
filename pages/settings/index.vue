<template>
    <v-container>
      <v-row no-gutters md="12">
        <v-col>
          <div class="text-h5">{{ $t('settings.title') }}</div>
        </v-col>
      </v-row>    
      <v-row no-gutters md="12">
        <v-col md="12">
          <v-form @submit.prevent="onSettingsSubmit" :disabled="isSettingsSubmitting">
            <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
              :label="$t('email')"></v-text-field>

            <v-text-field  autocomplete="one-time-code" v-model="password.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'" name="password" :label="$t('password')" :hint="$t('password_reset.new_pass')"
              counter :error-messages="password.errorMessage.value" @click:append="showPass = !showPass">
            </v-text-field>

            <v-btn type="submit" :disabled="isSettingsSubmitting" block class="mt-2" color="primary">{{ isSettingsSubmitting ? $t('loading') : $t('save') }}</v-btn>
          </v-form>
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
let settingsSaveSuccess = ref(false);

definePageMeta({
  layout: "default",
});

const { handleSubmit, isSubmitting: isSettingsSubmitting, setErrors } = useForm({
  initialValues: {
    email: stateUser.user.email,
    password: ''
  }
});

const email = useField('email', "required|email");
const password = useField('password', "min:8");

async function saveSettingsRequest(data) {
  
  const config = useRuntimeConfig();
  return await useFetchAuth(`${config.public.baseURL}/users/${stateUser.user.id}/profile/`, {
    method: 'PUT',
    body: {
      'email': data.email,
      'password': data.password
    }
  });
}


const onSettingsSubmit = handleSubmit(async values => {
  const somethingHasChanged = values.password || values.email != stateUser.user.email;
  if(!somethingHasChanged){
    return;
  }
  
  const response = await saveSettingsRequest(values);
  const error = response.error.value;
  if (!error) {
    stateUser.setUserEmail(values.email);
    settingsSaveSuccess.value = true;
    return;
  }
  let errors = {};
  for (const error_field in error.data) {
      errors[error_field] = t(`settings.errors.${error_field}.${error.data[error_field]}`);
  }
  setErrors(errors);

});

</script>
