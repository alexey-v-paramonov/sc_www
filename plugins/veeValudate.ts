import { configure, defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n';
import AllRules from '@vee-validate/rules';

import en from '@vee-validate/i18n/dist/locale/en.json';
import ru from '@vee-validate/i18n/dist/locale/ru.json';

localize({
  en: {
    fields: {
      email: {
        unique: 'Hey!2 Password cannot be empty',
      },
    },
  },
});

localize('en', {
  fields: {
    email: {
      unique: 'Hey! Password cannot be empty',
    },
  },
});
export default defineNuxtPlugin(nuxtApp => {
    Object.entries(AllRules).forEach(([id, validator]) => {
        defineRule(id, validator)
    });

    configure({
      generateMessage: localize({
        en,
        ru,
      }),
    });

})