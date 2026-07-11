<template>
  <div>
    <NuxtLayout name="auth">

      <v-container>
        <div>
          <h5 class="text-h5 mb-4">
            {{ $t('signup') }}
          </h5>
        </div>
        <v-form @submit.prevent="onSignupSubmit" :disabled="isSignupBusy">
          <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
            :label="$t('email')"></v-text-field>

          <v-text-field v-model="password1.value.value" :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'" name="password" :label="$t('password')" :hint="$t('chars_min_8')"
            counter :error-messages="password1.errorMessage.value" @click:append="showPass = !showPass"></v-text-field>
          <v-text-field v-model="password2.value.value" :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'" name="confirm" :label="$t('password_confirmation')"
            :hint="$t('chars_min_8')" counter :error-messages="password2.errorMessage.value"
            @click:append="showPass = !showPass"></v-text-field>

          <div class="mt-2 mb-4" v-if="locale == 'en'">
            <p class="text-body-2">
              By signing up, you agree with our <a href="https://streaming.center/agreement/" target="_blank">Terms & Conditions</a> and <a href="https://streaming.center/content/privacy_policy/" target="_blank">Privacy Policy</a>.
            </p>
          </div>

          <div class="mt-2 mb-2">
            <div ref="captchaContainer"></div>
            <p v-if="captchaError" class="text-error text-body-2 mt-1">{{ $t('captcha_required') }}</p>
          </div>

          <v-btn type="submit" color="primary" :disabled="isSignupBusy" block class="mt-2">
            {{ isSignupBusy ? $t('loading') : $t('create_account') }}</v-btn>

          <div class="mt-4">
            <p class="text-body-2">{{ $t('have_account') }} <NuxtLink to="/login">{{ $t('login') }}</NuxtLink>
            </p>
          </div>
        </v-form>
      </v-container>
    </NuxtLayout>
  </div>
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

// Captcha: Yandex SmartCaptcha on the Russian site, Cloudflare Turnstile on
// the English one.
const isRu = locale.value == 'ru';
const SMARTCAPTCHA_SITEKEY = 'ysc1_gz9VDvc5PJxSbSGsMdmV1TPfCiTtvd0awJXWSAIzfdf7ccbb';
const TURNSTILE_SITEKEY = '0x4AAAAAADzvBfJzpQje6jHF';
const captchaField = isRu ? 'smart-token' : 'cf-turnstile-response';
const captchaContainer = ref(null);
const captchaToken = ref('');
const captchaError = ref(false);
let captchaWidgetId = null;

function loadScript(src, marker) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-captcha="${marker}"]`);
    if (existing) {
      if (existing.dataset.loaded) return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.setAttribute('data-captcha', marker);
    script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function onCaptchaToken(token) {
  captchaToken.value = token;
  captchaError.value = false;
}

function resetCaptcha() {
  captchaToken.value = '';
  if (captchaWidgetId === null) return;
  if (isRu) {
    if (window.smartCaptcha) window.smartCaptcha.reset(captchaWidgetId);
  } else {
    if (window.turnstile) window.turnstile.reset(captchaWidgetId);
  }
}

onMounted(async () => {
  try {
    if (isRu) {
      await loadScript('https://smartcaptcha.yandexcloud.net/captcha.js', 'smartcaptcha');
      captchaWidgetId = window.smartCaptcha.render(captchaContainer.value, {
        sitekey: SMARTCAPTCHA_SITEKEY,
        hl: 'ru',
        callback: onCaptchaToken,
      });
    } else {
      await loadScript('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', 'turnstile');
      captchaWidgetId = window.turnstile.render(captchaContainer.value, {
        sitekey: TURNSTILE_SITEKEY,
        theme: 'light',
        callback: onCaptchaToken,
      });
    }
  } catch (e) {
    console.error('Failed to load captcha', e);
  }
});

async function signUpRequest(data) {
  const config = useRuntimeConfig();
  const body = {
    'email': data.email,
    'password': data.password1,
    'language': locale.value == 'en' ? 0 : 1,
    'currency': locale.value == 'en' ? 0 : 1,
  };
  body[captchaField] = captchaToken.value;
  return await $fetch(`${config.public.baseURL}/users/`, {
    method: 'POST',
    body,
  });
}

const { handleSubmit, isSubmitting: isSignupBusy, setErrors } = useForm();
const email = useField('email', "required|email");
const password1 = useField("password1", "required|min:8");
const password2 = useField(t("password_confirmation"), "required|min:8|confirmed:@password1");

const onSignupSubmit = handleSubmit(async values => {
  if (!captchaToken.value) {
    captchaError.value = true;
    return;
  }

  let response;
  try {
    response = await signUpRequest(values);
  }
  catch (e) {
    // The captcha token is single-use; reset it so the user can retry.
    resetCaptcha();
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
