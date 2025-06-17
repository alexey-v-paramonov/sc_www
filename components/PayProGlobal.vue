
<template>
    <div class="mt-8">
      <v-row md="12">
        <v-col>
          <div class="text-h6 mb-4" >Account Top‑Up via PayProGlobal</div>
          <p class="font-italic">Instant, fee-free top-ups with automatic payment processing and real-time balance updates. Choose from a wide range of payment methods.</p>
          <p>&nbsp;</p>
          <p>{{ $t('billing.invoice_request.service_fee') }}: <strong>0%</strong></p>
        </v-col>
      </v-row>
      <v-row md="12">
        <v-col md="12">
          <v-form @submit.prevent="checkoutSubmit" :disabled="working">

            <v-text-field class="mb-4" v-model="amount.value.value" type="number" :error-messages="amount.errorMessage.value"
              :label="$t('billing.invoice_request.amount')"
              hint="Minimum payment amount: 20 USD" persistent-hint
            ></v-text-field>

            <v-btn type="submit" :disabled="working" block class="mt-2" color="primary">Checkout securely via PayProGlobal</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </div>
</template>


<script setup>
import { useField, useForm } from 'vee-validate';
import { useUserStore } from '@/stores/user.js';

const stateUser = useUserStore()

definePageMeta({
  layout: "default",
});

const { handleSubmit, isSubmitting: working } = useForm({
  initialValues: {
    
  }
});

const amount = useField('amount', "required|min_value:5");

const checkoutSubmit = handleSubmit(async values => {
    const amount = parseFloat(values.amount);
    const userId = stateUser.user.id;
    const url = `https://store.payproglobal.com/checkout?products[1][id]=113863&currency=USD&products[1][price][USD][amount]=${amount}&x-userid=${userId}`;
    window.location.href = url;
});

</script>
