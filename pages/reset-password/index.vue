<template>
    <NuxtLayout name="auth">
  
      <v-container>
        <v-row no-gutters md="6">
          <v-col>&nbsp;</v-col>
          <v-col md="6">
            <h1>{{ $t('pass_reset_email_addr') }}</h1>
            <v-form @submit.prevent="resetPassword">

                <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
                :label="$t('email')"></v-text-field>

                <NuxtLink to="/login" class="text-body-2 font-weight-regular">{{ $t('pass_reset_back_to_login') }}</NuxtLink>
  
              <v-btn type="submit" :disabled="isPassResetSubmitting" block class="mt-2">{{ isPassResetSubmitting ? $t('loading') : $t('pass_reset_cta') }}</v-btn>
            </v-form>
            <div class="mt-2">
              <p class="text-body-2">{{ $t('account_creation_hint') }} <NuxtLink to="/signup">{{ $t('signup') }}</NuxtLink>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </NuxtLayout>
  </template>
    
  <script setup>
  import { useField, useForm } from 'vee-validate';
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/user.js';
  
  definePageMeta({
    layout: false,
  });
  
  let badCredentials = ref(false);
  const userStore = useUserStore();
  const router = useRouter();
  const showPass = ref(false);
  
  async function loginRequest(data) {
    const config = useRuntimeConfig();
    return await useFetch(`${config.public.baseURL}/api-token-auth/`, {
      //return await useFetch(`http://localhost:8000/api/v1/api-token-auth/`, {
      method: 'POST',
      body: {
        'username': data.email,
        'password': data.password
      }
    });
  }
  
  const { handleSubmit, isSubmitting: isPassResetSubmitting, setErrors } = useForm();
  
  const email = useField('email', "required|email");
  const password = useField('password', "required|min:8");
  
  const resetPassword = handleSubmit(async values => {
    badCredentials.value = false;
    const response = await loginRequest(values);
    const error = response.error.value;
    if (!error) {
      userStore.setUserData(response.data.value);
      router.push("/");
      return;
    }
    if (error.data['non_field_errors'] == 'bad_credentials') {
      badCredentials.value = true;
      return;
    }
    badCredentials.value = true;
  
  });
  
  </script>