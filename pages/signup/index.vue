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

          <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="password"
            :label="$t('password')" hint="At least 8 characters" counter 
            @click:append="show1 = !show1"></v-text-field>
          <!-- <error-message name="email">123</error-message> -->
          <v-btn type="submit" :disabled="isSignupSubmitting" block class="mt-2">{{ $t('create_account') }}</v-btn>
          <!--
                    <v-btn type="submit" @click="signUp()" block class="mt-2">{{ $t('create_account') }}</v-btn>
                    -->
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
    async function signUpRequest(data) {
      const config = useRuntimeConfig();
      return await $fetch(`${config.public.baseURL}/users/`, {
        method: 'POST',
        body: {
          'username': data.email,
          'email': data.email,
          'password': "123"// this.password
        }
      });
    }

    // function validateField(value) {
    //   if (!value) {
    //     return 'this field is required';
    //   }

    //   if (value.length < 8) {
    //     return 'this field must contain at least 8 characters';
    //   }

    //   return true;
    // }
    //const email = useField('email',);

    const { handleSubmit, isSubmitting: isSignupSubmitting, setErrors } = useForm();
    const email = useField('email', "email");

    const onSignupSubmit = handleSubmit(async values => {
      console.log("SUBMIT:", values)
      const response = await signUpRequest(values);
      console.log(response);
        // Send stuff to the API
    });
    return { email, onSignupSubmit, isSignupSubmitting }
  },
  data() {
    return {
      show1: false,
      show2: true,
      //email: '',
      password: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        isEmail: () => (`The email and password you entered don't match`),
      },
    }
  },
  created() {
  },
  methods: {
    //onSubmit(values) {
    //  console.log('Submitting :(', values);
    //},
    signUp() {
      this.signUpRequest().then((result) => {
        console.log("DONE: ", result)
      }).catch((error) => {
        console.error('ERROR:', error)
      });
    }
  }
}
</script>