import { configure, defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n';
//import AllRules from '@vee-validate/rules';
import * as AllRules from '@vee-validate/rules';


import en from '@vee-validate/i18n/dist/locale/en.json';
import ru from '@vee-validate/i18n/dist/locale/ru.json';


export default defineNuxtPlugin(nuxtApp => {
  const $t = nuxtApp.$i18n.t;
  Object.entries(AllRules).forEach(([id, validator]) => {
    defineRule(id, validator);
  });

  defineRule('ip', value => {
    if (!/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(value)) {
      return $t('errors.ip_invalid');
    }
    return true;
  });

  configure({
    generateMessage: localize({
      en,
      ru,
    }),
  });

})