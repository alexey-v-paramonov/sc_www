import { Form, Field, ErrorMessage } from 'vee-validate';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component(Form);
})