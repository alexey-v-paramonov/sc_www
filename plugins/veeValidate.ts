import { configure, defineRule } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n';
import * as AllRules from '@vee-validate/rules';



export default defineNuxtPlugin(nuxtApp => {
  const $t = nuxtApp.$i18n.t;
  setLocale(nuxtApp.$i18n.locale.value)
  Object.entries(AllRules).forEach(([id, validator]) => {
    defineRule(id, validator);
  });

  defineRule('ip', value => {
    if (!/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(value)) {
      return $t('errors.ip_invalid');
    }
    return true;
  });

  defineRule("required_if", (value, [target, targetValue]: [string, any], ctx) => {
    if (targetValue === ctx.form[target]) {
      return AllRules.required(value);
    }
    return true;
  });

  configure({
    generateMessage: localize({
      en: {
        names: {
          "password1": 'Password',
        },
        messages: {
          "_default": "The {field} is not valid",
          "alpha": "The {field} field may only contain alphabetic characters",
          "alpha_num": "The {field} field may only contain alpha-numeric characters",
          "alpha_dash": "The {field} field may contain alpha-numeric characters as well as dashes and underscores",
          "alpha_spaces": "The {field} field may only contain alphabetic characters as well as spaces",
          "between": "The {field} field must be between 0:{min} and 1:{max}",
          "confirmed": "The {field} field confirmation does not match",
          "digits": "The {field} field must be numeric and exactly contain 0:{length} digits",
          "dimensions": "The {field} field must be 0:{width} pixels by 1:{height} pixels",
          "email": "The {field} field must be a valid email",
          "not_one_of": "The {field} field is not a valid value",
          "ext": "The {field} field is not a valid file",
          "image": "The {field} field must be an image",
          "integer": "The {field} field must be an integer",
          "length": "The {field} field must be 0:{length} long",
          "max_value": "The {field} field must be 0:{max} or less",
          "max": "The {field} field may not be greater than 0:{length} characters",
          "mimes": "The {field} field must have a valid file type",
          "min_value": "The {field} field must be 0:{min} or more",
          "min": "The {field} field must be at least 0:{length} characters",
          "numeric": "The {field} field may only contain numeric characters",
          "one_of": "The {field} field is not a valid value",
          "regex": "Field format is invalid",
          "required_if": "This field is required",
          "size": "The {field} field size must be less than 0:{size}KB",
          "url": "The {field} field is not a valid URL",
          "required": "This field is required",
        },
      },
      ru: {
        fields: {
          password1: {
            required: 'Укажите пароль',
          },
        },        
        names: {
          "password1": 'Пароль',
        },
        "messages": {
          "_default": "Поле {field} некорректно",
          "alpha": "Поле {field} может содержать только буквы",
          "alpha_num": "Поле {field} может содержать только буквы и цифры",
          "alpha_dash": "Поле {field} может содержать только буквы, цифры и дефис",
          "alpha_spaces": "Поле {field} может содержать только буквы и пробелы",
          "between": "Поле {field} должно быть числом между 0:{min} и 1:{max}",
          "confirmed": "Поле {field} не совпадает с другим полем",
          "digits": "Поле {field} должно быть числом ровно из 0:{length} цифр",
          "dimensions": "Поле {field} должно быть изображением 0:{width} пикселей на 1:{height} пикселей",
          "email": "Поле {field} должно быть действительным электронным адресом",
          "not_one_of": "Поле {field} должно быть допустимым значением",
          "ext": "Поле {field} должно быть действительным файлом",
          "image": "Поле {field} должно быть изображением",
          "integer": "Поле {field} должно быть целым числом",
          "length": "Длина поля {field} должна быть 0:{length}",
          "max_value": "Поле {field} должно быть числом 0:{max} или меньше",
          "max": "Поле {field} не может быть длиннее 0:{length} символов",
          "mimes": "Поле {field} должно иметь допустимый тип файла",
          "min_value": "{min} или больше",
          "min": "Поле \"{field}\" должно быть не короче 0:{length} символов",
          "numeric": "Поле {field} должно быть числом",
          "one_of": "Поле {field} должно быть допустимым значением",
          "regex": "Поле имеет некорректный формат",
          "required_if": "Поле {field} обязательно для заполнения",
          "required": "Пожалуйста, заполните это поле",
          "size": "Поле {field} должно быть меньше, чем 0:{size}KB",
          "url": "Поле {field} содержит ссылку в некорректном формате"
        }
      },
    }),
  })
});
