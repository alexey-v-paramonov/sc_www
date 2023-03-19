<template>
    <v-container>
        <v-row no-gutters md="6">
            <v-col>&nbsp;</v-col>
            <v-col md="6">
                <h1><p>{{ $t('welcome') }}</p> Login</h1>
                <v-form @submit.prevent>
                    <v-text-field v-model="firstName" :rules="rules" label="Email"></v-text-field>
                    <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Normal with hint text"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
                              <v-btn type="submit" block class="mt-2">Submit</v-btn>
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
        password: 'Password',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => (`The email and password you entered don't match`),
        },
      }
    },
  }
</script>