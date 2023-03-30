import { configure, defineRule, Form, Field, ErrorMessage } from 'vee-validate'

import AllRules from '@vee-validate/rules'


export default defineNuxtPlugin(nuxtApp => {
    Object.entries(AllRules).forEach(([id, validator]) => {
        defineRule(id, validator)
      })    
    //nuxtApp.vueApp.component("Form", Form);
    //nuxtApp.vueApp.component("Field", Field);
    //nuxtApp.vueApp.component("ErrorMessage", ErrorMessage);
})