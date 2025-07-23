
<template>
    <div class="mt-8">
      <v-row md="12">
        <v-col>
          <div class="text-h6 mb-4" >{{ $t('billing.invoice_request.title') }}</div>
          <p class="font-italic">{{ $t('billing.invoice_request.internation_payment_hint') }}</p>
          <p>{{ $t('billing.invoice_request.service_fee') }}: <strong>15%</strong></p>
        </v-col>
      </v-row>
      <v-row md="12" v-if="!invoiceRequesSent">
        <v-col md="12">
          <v-form @submit.prevent="onInvoiceRequestSubmit" :disabled="isInvoiceRequestSubmitting">
            <v-text-field class="mb-4" v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
              :label="$t('email')"
              :hint="$t('billing.invoice_request.hint')" persistent-hint></v-text-field>

            <v-text-field class="mb-4" v-model="amount.value.value" type="number" :error-messages="amount.errorMessage.value"
              :label="$t('billing.invoice_request.amount')"
              :hint="$t('billing.invoice_request.amount_hint')" persistent-hint
            ></v-text-field>

            <v-btn type="submit" :disabled="isInvoiceRequestSubmitting" block class="mt-2" color="primary">{{ isInvoiceRequestSubmitting ? $t('loading') : $t('billing.invoice_request.request') }}</v-btn>
          </v-form>
        </v-col>
      </v-row>

      <v-row md="12" v-else>
        <v-col md="12">
          <br />
          <div v-if="locale == 'ru'">
            <p>Если вы запрашиваете счет в первый раз, то сначала мы отправим вам приглашение в платежную систему easystuff.io. Сервис позволяет осуществлять международные платежи за разработку программного обеспечения. Для оплаты счёта, вам необходимо принять приглашение и в дальнейшем мы сможем отправить вам счет в формате PDF, который содержит ссылку на оплату.</p>
            <br />
            <p><span class="font-weight-black">ВАЖНО: </span> ФИО при регистрации должно совпадать с ФИО плательщика.</p>
          </div>
          <div v-else>

            <p>If you are requesting an invoice for the first time, we will first send you an invitation to Easystuff.io payment system. This service allows you to make international payments for software development. To pay the bill, you need to accept the invitation, so we will be able to send you invoices in PDF format containing a payment link.</p>
            <br />
            <p><span class="font-weight-black">Important: </span> your registration name and lastname should be the same as the person why makes the payment.</p>
          </div>
        </v-col>
      </v-row>

    </div>
    <v-snackbar v-model="invoiceRequesSuccess" color="success">
      {{ $t('billing.invoice_request.invoice_request_accepted') }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="invoiceRequesSuccess = false">
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="invoiceRequesFailed" color="error">
      {{ $t('billing.invoice_request.invoice_request_failed') }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="invoiceRequesFailed = false">
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>

</template>


<script setup>
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js';

const stateUser = useUserStore()
const { t, locale } = useI18n();

let invoiceRequesSuccess = ref(false);
let invoiceRequesFailed = ref(false);
let invoiceRequesSent = ref(false);

definePageMeta({
  layout: "default",
});

const { handleSubmit, isSubmitting: isInvoiceRequestSubmitting, setErrors } = useForm({
  initialValues: {
    email: stateUser.user.email,
  }
});

const email = useField('email', "required|email");
const amount = useField('amount', "required|min_value:20");

async function invoiceRequest(data) {

  const config = useRuntimeConfig();
  return await fetchAuth(`${config.public.baseURL}/invoice_request/`, {
    method: 'POST',
    body: {
      'email': data.email,
      'amount': data.amount,
    }
  });
}


const onInvoiceRequestSubmit = handleSubmit(async values => {
  const response = await invoiceRequest(values);

  const error = response.error;
  if (!error) {
    invoiceRequesSuccess.value = true;
    invoiceRequesSent.value = true;
    return;
  }

  if(typeof error.data == 'object'){
    let errors = {};
    for (const error_field in error.data) {
        errors[error_field] = t(`billing.invoice_request.${error_field}.${error.data[error_field]}`);
    }
    setErrors(errors);
  }
  else{
    invoiceRequesFailed.value = true;
  }
});

</script>
