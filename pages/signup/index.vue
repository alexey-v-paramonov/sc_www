<template>
  <NuxtLayout name="auth">

    <v-container>
      <v-row no-gutters md="6">
        <v-col>&nbsp;</v-col>
        <v-col md="6">
          <h1>{{ $t('signup') }}</h1>
          <v-form @submit.prevent="onSignupSubmit" :disabled="isSignupBusy">
            <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
              :label="$t('email')"></v-text-field>

            <v-text-field v-model="password1.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'" name="password" :label="$t('password')" :hint="$t('chars_min_8')"
              counter :error-messages="password1.errorMessage.value" @click:append="showPass = !showPass"></v-text-field>
            <v-text-field v-model="password2.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'" name="password" :label="$t('password_confirmation')"
              :hint="$t('chars_min_8')" counter :error-messages="password2.errorMessage.value"
              @click:append="showPass = !showPass"></v-text-field>

            <v-btn type="submit" :disabled="isSignupBusy" block class="mt-2">
              {{ isSignupBusy ? $t('loading') : $t('create_account') }}</v-btn>

            <div class="mt-2">
              <p class="text-body-2">{{$t('have_account')}} <NuxtLink to="/login">{{ $t('login') }}</NuxtLink>
              </p>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </NuxtLayout>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import { useUserStore } from '@/stores/user.js';
import { ref, onMounted } from 'vue'


definePageMeta({
  layout: false,
});
const { locale, t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const showPass = ref(false);

onMounted(() => {

})

async function signUpRequest(data) {
  const config = useRuntimeConfig();
  return await $fetch(`${config.public.baseURL}/users/`, {
    method: 'POST',
    body: {
      'email': data.email,
      'password': data.password1,
      'language': locale.value == 'en' ? 0 : 1,
      'currency': locale.value == 'en' ? 0 : 1,
    }
  });
}

const { handleSubmit, isSubmitting: isSignupBusy, setErrors } = useForm();
const email = useField('email', "required|email");
const password1 = useField("password1", "required|min:8");
const password2 = useField(t("password_confirmation"), "required|min:8|confirmed:@password1");

const onSignupSubmit = handleSubmit(async values => {
  let response;
  try {
    response = await signUpRequest(values);
  }
  catch (e) {
    if (typeof e == 'object') {
      let errors = {};
      for (const error_field in e.data) {
        errors[error_field] = t(`${error_field}.errors.${e.data[error_field]}`);
      }
      setErrors(errors);
    }

    return;
  }
  userStore.setUserData(response);
  router.push("/");
});

</script>