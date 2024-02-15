<template>
  <div>
    <NuxtLayout name="auth">

      <v-container>
        <v-row no-gutters md="6">
          <v-col>&nbsp;</v-col>
          <v-col md="6">
            <h1 v-if="!resetConfirmDone && !badToken">{{ $t('password_reset.new_pass') }}</h1>

            <!-- Confirm form -->
            <v-form v-if="!resetConfirmDone && !badToken" @submit.prevent="resetConfirmPassword"
              :disabled="isPassResetConfirmSubmitting">

              <v-text-field v-model="password.value.value" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'" name="password" :label="$t('password')" :hint="$t('chars_min_8')"
                counter :error-messages="password.errorMessage.value" @click:append="showPass = !showPass"></v-text-field>

              <NuxtLink to="/login" class="text-body-2 font-weight-regular">{{ $t('password_reset.back_to_login') }}
              </NuxtLink>

              <v-btn type="submit" :disabled="isPassResetConfirmSubmitting" block class="mt-2">{{
                isPassResetConfirmSubmitting ? $t('loading') : $t('password_reset.cta') }}</v-btn>
            </v-form>

            <div class="mt-2" v-if="badToken">
              <v-card :title="$t('password_reset.token_is_invalid')" :text="$t('password_reset.token_is_invalid_text')"
                prepend-icon="mdi-alert">
                <v-card-actions>
                  <v-btn @click="goToPasswordReset()">
                    {{ $t('password_reset.cta') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
            <div class="mt-2" v-if="resetConfirmDone">
              <v-card :title="$t('password_reset.done_title')" :text="$t('password_reset.done_text')"
                prepend-icon="mdi-check">
                <v-card-actions>
                  <v-btn @click="goToLogin()">
                    {{ $t('password_reset.back_to_login') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
            <div class="mt-2" v-if="!resetConfirmDone">
              <p class="text-body-2">{{ $t('account_creation_hint') }} <NuxtLink to="/signup">{{ $t('signup') }}
                </NuxtLink>
              </p>
            </div>
          </v-col>
        </v-row>
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

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const showPass = ref(false);

const resetToken = ref(route.query.t || '')
const resetUID = ref(route.query.u || '')
const resetConfirmMode = ref(Boolean(resetToken.value) && Boolean(resetUID.value));
let badToken = ref(false);

if (!resetConfirmMode.value) {
  router.push("/reset-password");
}

const resetConfirmDone = ref(false);

async function resetConfirmPasswordRequest(data) {
  const config = useRuntimeConfig();
  return await useFetch(`${config.public.baseURL}/password_reset/confirm/`, {
    method: 'POST',
    body: {
      'password': data.password,
      'token': resetToken.value,
      'uid': resetUID.value,
    }
  });
}

const { handleSubmit, isSubmitting: isPassResetConfirmSubmitting, setErrors } = useForm();
const password = useField("password", "required|min:8");

const resetConfirmPassword = handleSubmit(async values => {
  badToken.value = false;

  const response = await resetConfirmPasswordRequest(values);
  const error = response.error.value;
  if (!error) {
    resetConfirmDone.value = true;
    return;
  }

  if (error.data['non_field_errors'] == 'token_invalid') {
    badToken.value = true;
    return;
  }

  let errors = {};
  for (const error_field in error.data) {
    // Put all errors into the password field
    error_field = 'password';
    errors[error_field] = t(`password_reset.errors.${error_field}.${error.data[error_field]}`);
  }
  setErrors(errors);
});

function goToPasswordReset() {
  router.push("/reset-password/");
}
function goToLogin() {
  router.push("/login");
}

</script>