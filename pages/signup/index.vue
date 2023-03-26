<template>
    <v-container>
        <v-row no-gutters md="6">
            <v-col>&nbsp;</v-col>
            <v-col md="6">
                <h1>{{ $t('signup') }}</h1>
                <Form as="v-form" @submit.prevent>
                    <v-text-field v-model="email" type="email" :rules="rules" :label="$t('email')"></v-text-field>
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
                    <v-btn type="submit" @click="signUp()" block class="mt-2">{{ $t('create_account') }}</v-btn>
                </Form>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
export default {
    data () {
      return {
        show1: false,
        show2: true,
        email: '',
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