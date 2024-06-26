<template>
  <div>
    <NuxtLayout name="auth">

      <v-container>
        <div>
          <h5 class="text-h5 mb-4">
            {{ resetDone ? $t('password_reset.check_inbox') : $t('password_reset.email_address') }}
          </h5>
        </div>
        <v-form @submit.prevent="resetPassword" v-if="!resetDone" :disabled="isPassResetSubmitting">

          <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
            :label="$t('email')"></v-text-field>

          <NuxtLink to="/login" class="text-body-2 font-weight-regular">{{ $t('password_reset.back_to_login') }}
          </NuxtLink>

          <v-btn type="submit" color="primary" :disabled="isPassResetSubmitting" block class="mt-2">{{ isPassResetSubmitting ?
            $t('loading') : $t('password_reset.cta') }}</v-btn>
        </v-form>


        <div class="mt-2" v-if="resetDone">
          {{ $t('password_reset.check_inbox_email') }} <strong>{{ email.value.value }}</strong>
          <v-card :title="$t('password_reset.check_inbox_hint_head')" :text="$t('password_reset.check_inbox_hint_text')"
            prepend-icon="mdi-alert">
            <v-card-actions>
              <v-btn @click="resetDone = false">
                {{ $t('password_reset.resend') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <div class="mt-4">
          <p class="text-body-2">{{ $t('account_creation_hint') }} <NuxtLink to="/signup">{{ $t('signup') }}
            </NuxtLink>
          </p>
        </div>
      </v-container>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';


definePageMeta({
  layout: false,
});

const { locale, t } = useI18n();
const route = useRoute();

const resetDone = ref(false);


async function resetPasswordRequest(data) {
  const config = useRuntimeConfig();
  return await $fetch(`${config.public.baseURL}/password_reset/`, {
    method: 'POST',
    body: {
      'email': data.email,
      'lang': locale.value
    }
  });
}

const { handleSubmit, isSubmitting: isPassResetSubmitting, setErrors } = useForm();

const email = useField('email', "required|email");

const resetPassword = handleSubmit(async values => {

  let response;
  try{
    response = await resetPasswordRequest(values);
  }
  catch(e){
    if (typeof e == 'object') {
      let errors = {};
      for (const error_field in e.data) {
        errors[error_field] = t(`password_reset.errors.${error_field}.${e.data[error_field]}`);
      }
      setErrors(errors);
    }
    return;
  }

  resetDone.value = true;


});


</script>
