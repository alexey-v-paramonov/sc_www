<template>
    <v-container>
        <v-row no-gutters md="6">
            <v-col>&nbsp;</v-col>
            <v-col md="6">
                <h1>{{ $t('login') }}</h1>
                <v-form @submit.prevent="onLoginSubmit">
                    <v-alert 
                    v-if="badCredentials"
                    :title="$t('login')"
                    color="error"
                    closable
                    border="start"
                    icon="mdi-message-alert"
                    :text="$t('bad_credentials')"></v-alert>
                    <br>
                    <v-text-field 
                      v-model="email.value.value"
                      type="email"
                      :error-messages="email.errorMessage.value"
                      :label="$t('email')"
                    ></v-text-field>

                    <v-text-field 
                      v-model="password.value.value" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'" name="password"
                        :label="$t('password')" hint="At least 8 characters" counter 
                        :error-messages="password.errorMessage.value"
                        @click:append="show1 = !show1">
                    </v-text-field>

                    <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a>

                    <v-btn type="submit" :disabled="isSignupSubmitting" block class="mt-2">{{ $t('login') }}</v-btn>
                </v-form>
                <div class="mt-2">
                  <p class="text-body-2">Don't have an account? <NuxtLink to="/signup">{{ $t('signup') }}</NuxtLink></p>
                </div>                
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue'


export default {
  setup() {
    let badCredentials = ref(false);

    async function loginRequest(data) {
      const config = useRuntimeConfig();
      return await useFetch(`${config.public.baseURL}/api-token-auth/`, {
        // return await useFetch(`http://localhost:8000/api/v1/api-token-auth/`, {
        method: 'POST',
        body: {
          'username': data.email,
          'password': data.password
        }
      });
    }

    const { handleSubmit, isSubmitting: isSignupSubmitting, setErrors } = useForm();

    const email = useField('email', "required|email");
    const password = useField('password', "required|min:8");

    const onLoginSubmit = handleSubmit(async values => {
      badCredentials.value = false;
      const response = await loginRequest(values);
      const error = response.error.value;
      if( !error ){
        console.log("Ok")
        return;
      }
      if(error.data['non_field_errors'] == 'bad_credentials'){
        badCredentials.value = true;
        return;
      }
      console.log("Errors!", error.data)
      setErrors({'email': t("email.errors.unique")})
    });
    return { email, password, onLoginSubmit, isSignupSubmitting, badCredentials }

  },
  data () {
      return {
        show1: false,
      }
    },
    created(){
    },
    methods: {
    }
  }
</script>