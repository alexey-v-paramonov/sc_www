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
  
  definePageMeta({
    layout: false,
  });
    
  async function resetPasswordRequest(data) {
    const config = useRuntimeConfig();
    return await useFetch(`${config.public.baseURL}/api-token-auth/`, {
      method: 'POST',
      body: {
        'email': data.email,
      }
    });
  }
  
  const { handleSubmit, isSubmitting: isPassResetSubmitting, setErrors } = useForm();
  
  const email = useField('email', "required|email");
  
  const resetPassword = handleSubmit(async values => {
    const response = await resetPasswordRequest(values);
    const error = response.error.value;
    if (!error) {
        return;
    }
    //console.log("Errors: ", error.data)
    let errors = {};
    for (const error_field in error.data) {
        errors[error_field] = t(`${error_field}.errors.${error.data[error_field]}`);
    }
    setErrors(errors);

  
  });
  
  </script>