<template>
  <NuxtLayout name="auth">

    <v-container>
      <v-row no-gutters md="6">
        <v-col>&nbsp;</v-col>
        <v-col md="6">
          <h1>{{ $t('signup') }}</h1>
          <form @submit.prevent="onSignupSubmit">
            <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
              :label="$t('email')"></v-text-field>

            <v-text-field v-model="password1.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'" name="password" :label="$t('password')" :hint="$t('chars_min_8')"
              counter :error-messages="password1.errorMessage.value" @click:append="showPass = !showPass"></v-text-field>
            <v-text-field v-model="password2.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'" name="password" :label="$t('password_confirmation')"
              :hint="$t('chars_min_8')" counter :error-messages="password2.errorMessage.value"
              @click:append="showPass = !showPass"></v-text-field>


            <v-btn type="submit" :disabled="isSignupSubmitting" block class="mt-2">{{ $t('create_account') }}</v-btn>
            <div class="mt-2">
              <p class="text-body-2">Already have an account? <NuxtLink to="/login">{{ $t('login') }}</NuxtLink>
              </p>
            </div>
          </form>
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
  return await useFetch(`${config.public.baseURL}/users/`, {
    //return await useFetch(`http://127.0.0.1:8000/api/v1/users/`, {
    method: 'POST',
    body: {
      'email': data.email,
      'password': data.password1,
      'language': locale.value == 'en' ? 0 : 1,
      'currency': locale.value == 'en' ? 0 : 1,
    }
  });
}

// const formValues = {
//   email: 'test@test.com',
//   password1: '123123123',
//   password2: '123123123',
// };    

const formValues = {
  email: '',
  password1: '',
  password2: '',
};

const { handleSubmit, isSubmitting: isSignupSubmitting, setErrors } = useForm({
  //initialValues: formValues,
});
const email = useField('email', "required|email");
// const password1 = useField(t("password"), "required|min:8");
// const password2 = useField(t("password_confirmation"), "required|min:8|confirmed:@password1");
const password1 = useField("password1", "required|min:8");
const password2 = useField(t("password_confirmation"), "required|min:8|confirmed:@password1");

const onSignupSubmit = handleSubmit(async values => {
  const response = await signUpRequest(values);
  const error = response.error.value;
  if (!error) {
    userStore.setUserData(response.data.value);
    router.push("/");
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