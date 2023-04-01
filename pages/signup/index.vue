<template>
    <v-container>
        <v-row no-gutters md="6">
            <v-col>&nbsp;</v-col>
            <v-col md="6">
                <h1>{{ $t('signup') }}</h1>
                <v-form @submit="onSubmit">
                    <v-text-field name="email" 
                           v-model="email.value.value" type="email" 
                           :error-messages="email.errorMessage.value"
                           :label="$t('email')"></v-text-field>

                    <v-text-field
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        :label="$t('password')"
                        hint="At least 8 characters"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>
                    <!-- <error-message name="email">123</error-message> -->
                    <v-btn type="submit" block class="mt-2">{{ $t('create_account') }}</v-btn>
                    <!--
                    <v-btn type="submit" @click="signUp()" block class="mt-2">{{ $t('create_account') }}</v-btn>
                    -->
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import { useField } from 'vee-validate';
  //import { required, email as emailRule, min } from '@vee-validate/rules';
  import { defineRule } from 'vee-validate';


export default {
  // Note: setErrors for setting individual field errors

  setup () {

    function validateField(value) {
      if (!value) {
        return 'this field is required';
      }

      if (value.length < 8) {
        return 'this field must contain at least 8 characters';
      }

      return true;
    }    
    const email = useField('email', "email");
    return { email }
  },
    data () {
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
    created(){
    },
    methods: {
      validateEmail() {
        return "123";
        // if the field is empty
        if (!value) {
          return 'This field is required';
        }
        // if the field is not a valid email
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!regex.test(value)) {
          return 'This field must be a valid email';
        }
        // All is good
        return true;
        },      
      onSubmit(values) {
        console.log('Submitting :(', values);
      },        
      async signUpRequest() {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.baseURL}/users/`, { 
            method: 'POST',
            body: {
                'username': this.email,
                'email': this.email,
                'password': this.password
            }
        });
      },
      signUp(){
        this.signUpRequest().then( (result) => {
            console.log("DONE: ", result)
        }).catch( (error) => {
            console.error('ERROR:', error)
        });
      }
    }
  }
</script>