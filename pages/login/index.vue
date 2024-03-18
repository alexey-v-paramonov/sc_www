<template>
  <div>
    <NuxtLayout name="auth">

      <v-container>
        <h1>{{ $t('login') }}</h1>
        <v-form @submit.prevent="onLoginSubmit" :disabled="isSignupSubmitting">
          <v-alert v-if="badCredentials" :title="$t('login')" color="error" closable border="start"
            icon="mdi-message-alert" :text="$t('bad_credentials')"></v-alert>
          <br>
          <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
            :label="$t('email')"></v-text-field>

          <v-text-field v-model="password.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'" name="password" :label="$t('password')" :hint="$t('chars_min_8')"
            counter :error-messages="password.errorMessage.value" @click:append="showPass = !showPass">
          </v-text-field>

          <NuxtLink to="/reset-password" class="text-body-2 font-weight-regular">{{ $t('forgot_password') }}
          </NuxtLink>

          <v-btn type="submit" :disabled="isSignupSubmitting" block class="mt-2">{{ isSignupSubmitting ?
            $t('logging_in') : $t('login') }}</v-btn>
        </v-form>
        <div class="mt-2">
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
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js';

definePageMeta({
  layout: false,
});

let badCredentials = ref(false);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const showPass = ref(false);
const token = route.query.t;
const userID = route.query.id;
const userEmail = route.query.email;

if(token && userID && userEmail){
  userStore.setUserData({
    token: token,
    id:userID,
    email: userEmail,
  });
  userStore.getUserData();
  router.push("/");
}

async function loginRequest(data) {
  const config = useRuntimeConfig();
  return await $fetch(`${config.public.baseURL}/api-token-auth/`, {
    method: 'POST',
    body: {
      'username': data.email,
      'password': data.password
    }
  });
}

const { handleSubmit, isSubmitting: isSignupSubmitting } = useForm();

const email = useField('email', "required|email");
const password = useField('password', "required|min:7");

const onLoginSubmit = handleSubmit(async values => {
  badCredentials.value = false;
  let response;
  try {
    response = await loginRequest(values);
  }
  catch (e) {
    badCredentials.value = true;
    // if (e.data['non_field_errors'] == 'bad_credentials') {
    //   return;
    // }
    return;
  }
  userStore.setUserData(response);
  userStore.getUserData();
  router.push("/");

});

</script>