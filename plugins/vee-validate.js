import Vue from 'vue';
import VeeValidate from 'vee-validate';
import VueI18n from 'vue-i18n'

export default ({ app }) => {
  Vue.use(VeeValidate, {
    inject: true,
    i18n: app.i18n, // the vue-i18n plugin instance
    i18nRootKey: 'validations',
    fieldsBagName: 'formFields'
    //locale: 'en'
  });
}