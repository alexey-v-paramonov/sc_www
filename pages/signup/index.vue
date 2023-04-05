<template>
  <v-container>
    <v-row no-gutters md="6">
      <v-col>&nbsp;</v-col>
      <v-col md="6">
        <h1>{{ $t('signup') }}</h1>
        <form @submit.prevent="onSignupSubmit">
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
            @click:append="show1 = !show1"></v-text-field>
          <v-btn type="submit" :disabled="isSignupSubmitting" block class="mt-2">{{ $t('create_account') }}</v-btn>
          <div class="mt-2">
            <p class="text-body-2">Already have an account? <NuxtLink to="/login">{{ $t('login') }}</NuxtLink></p>
          </div>                
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useField, useForm } from 'vee-validate';

export default {
  // Note: setErrors for setting individual field errors

  setup() {
    const { t } = useI18n();

    async function signUpRequest(data) {
      const config = useRuntimeConfig();
      return await useFetch(`${config.public.baseURL}/users/`, {
        method: 'POST',
        body: {
          //'username': data.email,
          'email': data.email,
          'password': data.password
        }
      });
    }

    const formValues = {
      email: '',
      password: '',
    };    

    // const formValues = {
    //   email: 'test@test.com',
    //   password: 'password',
    // };    

    const { handleSubmit, isSubmitting: isSignupSubmitting, setErrors } = useForm({
      initialValues: formValues,
    });
    const email = useField('email', "required|email");
    const password = useField('password', "required|min:8");

    const onSignupSubmit = handleSubmit(async values => {
      const response = await signUpRequest(values);
      const error = response.error.value;
      if( !error ){
        console.log("Ok")
        return;
      }
      console.log("Errors!", error.data)
      setErrors({'email': t("email.errors.unique")})
      // signUpRequest(values).then(
      //   (result) => {
      //     const error = result.error.value;
      //     if( !error ){
      //       console.log("Ok")
      //       return;
      //     }

      //    setErrors({'email': t("email.errors.unique")})
      //   }
      // ).catch((error) => {
      //   console.error('ERROR:', error)
      // });
    });
    return { email, password, onSignupSubmit, isSignupSubmitting }
  },
  data() {
    return {
      show1: false,
    }
  },
  created() {
  },
  methods: {
  }
}
</script>