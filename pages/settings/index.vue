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
  </template>
  
<script setup>
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js';
import { useUiStateStore } from '@/stores/ui'

const stateUser = useUserStore()
const stateUI = useUiStateStore()
const showPass = ref(false);

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
  return await useFetch(`${config.public.baseURL}/users/${stateUser.user.id}/settings/`, {
    method: 'PUT',
    body: {
      'email': data.email,
      'new_password': data.password
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
    userStore.setUserEmail(values.email);
    return;
  }
  if (error.data['non_field_errors'] == 'bad_credentials') {
    badCredentials.value = true;
    return;
  }
  else{
    console.log("HERE!")
  }

});

</script>
