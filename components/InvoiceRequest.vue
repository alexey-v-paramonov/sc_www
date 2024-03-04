
<template>
    <v-container>
      <v-row no-gutters md="12">
        <v-col>
          <div class="text-h6">{{ $t('billing.invoice_request.title') }}</div>
          <p class="font-italic">{{ $t('billing.invoice_request.internation_payment_hint') }}</p>
          <p>{{ $t('billing.invoice_request.service_fee') }}: <strong>15%</strong> <span class="font-italic">({{ $t('billing.invoice_request.looking') }})</span></p>
        </v-col>
      </v-row>    
      <v-row no-gutters md="12">
        <v-col md="12">
          <v-form @submit.prevent="onInvoiceRequestSubmit" :disabled="isInvoiceRequestSubmitting">
            <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
              :label="$t('email')"
              :hint="$t('billing.invoice_request.hint')" persistent-hint></v-text-field>

            <v-text-field v-model="amount.value.value" type="number" :error-messages="amount.errorMessage.value"
              :label="$t('billing.invoice_request.amount')"
              :hint="$t('billing.invoice_request.amount_hint')" persistent-hint
            ></v-text-field>

            <v-btn type="submit" :disabled="isInvoiceRequestSubmitting" block class="mt-2" color="primary">{{ isInvoiceRequestSubmitting ? $t('loading') : $t('billing.invoice_request.request') }}</v-btn>
          </v-form>
        </v-col>
      </v-row>

    </v-container>
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
  
  const error = response.error.value;
  if (!error) {
    invoiceRequesSuccess.value = true;
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