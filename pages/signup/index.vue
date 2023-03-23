<template>
    <v-container>
        <v-row no-gutters md="6">
            <v-col>&nbsp;</v-col>
            <v-col md="6">
                <h1>{{ $t('login') }}</h1>
                <v-form @submit.prevent>
                    <v-text-field v-model="email" :rules="rules" :label="$t('email')"></v-text-field>
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
                    <v-btn type="submit" @click="signUp()" block class="mt-2">{{ $t('login') }}</v-btn>
                </v-form>
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
          emailMatch: () => (`The email and password you entered don't match`),
        },
      }
    },
    created(){
      const config = useRuntimeConfig();
      console.log("API URL!", config.public.baseURL);
    },
    methods: {
      async signUpRequest() {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.baseURL}/api/users`, { 
            method: 'POST',
            body: {
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