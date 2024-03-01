<template>
    <v-container>
      
      <v-row no-gutters md="12">
        <v-col cols="6" class="text-center" >{{ $t('billing.balance') }}</v-col>
        <v-col cols="6" class="text-center" >{{stateUser.user.userData.balance}} {{ $t('currency')}}</v-col>
      </v-row>
      <v-row no-gutters md="12">
        <v-col cols="6" class="text-center" >{{ $t('billing.mothly_charges') }}</v-col>
        <v-col cols="6" class="text-center" >{{ charges ? charges.total : '-'}} {{ $t('currency')}}</v-col>
      </v-row>

      

      <v-row no-gutters md="12">
        <v-col cols="12">

          <YooMoney v-if="locale=='ru'"/>

          <InvoiceRequest />

          </v-col>
      </v-row>
      <hr />
      <v-row md="12"  v-for="(val, key) in customPaymentMethods" :key="key">
        <v-col cols="12">
          <div class="text-h6">{{ val['title'][locale] }}</div>
          <div class="font-italic" v-if="val['note'][locale]">{{ val['note'][locale] }}</div>
          <div>{{ $t('billing.invoice_request.service_fee') }}: <strong>{{ val['fee'] }}%</strong></div>
          <div v-html="val['html'][locale]"></div>
        </v-col>
      </v-row>    

    </v-container>
  </template>
  
<script setup>

import { useUserStore } from '~/stores/user'
const stateUser = useUserStore()
const { locale } = useI18n();
import { ref, reactive, onMounted } from 'vue';
let charges = null;
let customPaymentMethods = reactive({});

onMounted(() => {
  getCustomPaymentMethods();
  getMonthlyTotalCharge();
})

async function getMonthlyTotalCharge() {
  const config = useRuntimeConfig();

  charges = await fetchAuth(`${config.public.baseURL}/month_total_charge/`, {
        method: 'GET',
  });
  
}

async function getCustomPaymentMethods() {
  
  const config = useRuntimeConfig();
  const paymentMethods = await useFetchAuth(`${config.public.baseURL}/custom_payment_methods/`, {
    method: 'GET',
  });

  Object.assign(customPaymentMethods, paymentMethods.data.value)


  console.log("METHODS: ", customPaymentMethods)
}

</script>
