<template>
    <NuxtLayout name="auth">
  
      <v-container>
        <v-row no-gutters md="6">
          <v-col>&nbsp;</v-col>
          <v-col md="6">
            <h1 v-if="resetConfirmMode">{{ $t('password_reset.new_pass') }}</h1>
            <h1 v-else>{{ resetDone ? $t('password_reset.check_inbox') : $t('password_reset.email_address') }}</h1>
            <v-form @submit.prevent="resetPassword" v-if="!resetDone && !resetConfirmMode">

                <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
                :label="$t('email')"></v-text-field>

                <NuxtLink to="/login" class="text-body-2 font-weight-regular">{{ $t('password_reset.back_to_login') }}</NuxtLink>
  
              <v-btn type="submit" :disabled="isPassResetSubmitting" block class="mt-2">{{ isPassResetSubmitting ? $t('loading')  : $t('password_reset.cta') }}</v-btn>
            </v-form>

            <!-- Confirm form -->
            <v-form @submit.prevent="resetConfirmPassword" v-if="resetConfirmMode">

              <v-text-field v-model="password.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'" name="password" :label="$t('password')" :hint="$t('chars_min_8')"
              counter :error-messages="password.errorMessage.value" @click:append="showPass = !showPass"></v-text-field>

              <NuxtLink to="/login" class="text-body-2 font-weight-regular">{{ $t('password_reset.back_to_login') }}</NuxtLink>

              <v-btn type="submit" :disabled="isPassResetConfirmSubmitting" block class="mt-2">{{ isPassResetSubmitting ? $t('loading')  : $t('password_reset.cta') }}</v-btn>
            </v-form>

            <div class="mt-2" v-if="resetDone">
              {{ $t('password_reset.check_inbox_email') }} <strong>{{ email.value.value }}</strong>
              <v-card
                :title="$t('password_reset.check_inbox_hint_head')"
                :text="$t('password_reset.check_inbox_hint_text')"
                prepend-icon="mdi-alert"
              >
              <v-card-actions>
                <v-btn @click="resetDone = false">
                  {{ $t('password_reset.resend') }}
                </v-btn>
              </v-card-actions>
            </v-card>              
            </div>
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
  import { ref } from 'vue';

  
  definePageMeta({
    layout: false,
  });

  const { locale, t } = useI18n();
  const route = useRoute();
  const showPass = ref(false);

  const resetToken = ref(route.query.t || '')
  const resetUID = ref(route.query.u || '')
  const resetConfirmMode = ref(Boolean(resetToken.value) && Boolean(resetUID.value));
  
  const resetDone = ref(false);
  const resetConfirmDone = ref(false);
  const password = useField("password", "required|min:8");


  async function resetPasswordRequest(data) {
    const config = useRuntimeConfig();
    return await useFetch(`${config.public.baseURL}/password_reset/`, {
      method: 'POST',
      body: {
        'email': data.email,
        'lang': locale
      }
    });
  }

  async function resetConfirmPasswordRequest(data) {
    const config = useRuntimeConfig();
    return await useFetch(`${config.public.baseURL}/password_reset/confirm/`, {
      method: 'POST',
      body: {
        'email': data.password,
        'lang': locale
      }
    });
  }
  
  const { handleSubmit, isSubmitting: isPassResetSubmitting, setErrors } = useForm();
  
  const email = useField('email', "required|email");
  
  const resetPassword = handleSubmit(async values => {
    const response = await resetPasswordRequest(values);
    const error = response.error.value;
    if (!error) {
      resetDone.value = true;
      return;
    }
    //console.log("Errors: ", error.data)
    let errors = {};
    for (const error_field in error.data) {
        errors[error_field] = t(`password_reset.errors.${error_field}.${error.data[error_field]}`);
    }
    setErrors(errors);

  
  });
  
  const resetConfirmPassword = handleSubmit(async values => {
    console.log(values);
    return;
    const response = await resetConfirmPasswordRequest(values);
    const error = response.error.value;
    if (!error) {
      resetConfirmDone.value = true;
      return;
    }
    let errors = {};
    for (const error_field in error.data) {
        errors[error_field] = t(`password_reset.errors.${error_field}.${error.data[error_field]}`);
    }
    setErrors(errors);

  
  });
  
  </script>