<template>
  <v-container>
    <v-alert type="info" class="mb-4">
      <v-row no-gutters md="12">
        <v-col cols="6" class="mb-2">{{ $t('billing.balance') }}</v-col>
        <v-col cols="6"><strong>{{ stateUser.user.userData.balance }} {{ $t('currency') }}</strong></v-col>
      </v-row>
      <v-row no-gutters md="12">
        <v-col cols="6" class="">{{ $t('billing.mothly_charges') }}</v-col>
        <v-col cols="6"><strong>{{ monthly_charges ? monthly_charges.total : '-' }} {{ $t('currency')
            }}</strong></v-col>
      </v-row>
    </v-alert>
    <v-row no-gutters md="12" v-if="charges.length > 0">
      <v-col>
        <div class="text-h6">{{ $t('billing.latest_charges') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12" v-if="charges.length > 0">
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('billing.date') }}
              </th>
              <th class="text-left">
                {{ $t('billing.service') }}
              </th>
              <th class="text-left">
                {{ $t('billing.amount') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(charge, index) in charges" :key="charge.id"
              :class="{ 'interleaved-table-row': charge.another_day }">
              <td>{{ charge.created }}</td>
              <td>
                <span v-if="charge.service_type == 1">{{ $t('billing.service_self_hosted') }}: </span>
                <span v-if="charge.service_type == 2">{{ $t('billing.service_hosted') }}: </span>
                <span v-if="charge.service_type == 3">{{ $t('billing.service_du') }}: </span>
                <span v-if="charge.service_type == 4">{{ $t('billing.service_tts') }}: </span>
                {{ charge.description }}
              </td>
              <td>{{ charge.price }} {{ $t('currency') }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-8" md="12" v-if="payments.length > 0">
      <v-col>
        <div class="text-h6">{{ $t('billing.latest_payments') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12" v-if="payments.length > 0">
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('billing.date') }}
              </th>
              <th class="text-left">
                {{ $t('billing.amount') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.created }}</td>
              <td>{{ payment.amount }} {{ $t('currency') }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>


    <v-row no-gutters md="12">
      <v-col cols="12">

        <YooMoney class="mt-8" v-if="locale == 'ru'" />

        <PayProGlobal class="mt-8" v-if="locale == 'en'" />

        <InvoiceRequest class="mt-8" v-if="locale == 'en'" />

      </v-col>
    </v-row>
    <hr class="mt-8 mb-8" v-if="locale == 'ru'" />

    <v-row no-gutters md="12" v-if="locale == 'ru'">
      <v-col cols="12">
        <div class="text-h6">Оплата зарубежными картами</div>
        <p>
          Перейдите на <a href="https://app.streaming.center/" target="_blank"><u>международную версию личного кабинета
              на английском языке</u></a>
          и пополните счет в $ любыми картами, Paypal и прочими методами оплаты. </p>
        <p>
          Пароль и логин от личного кабинета - те же.
        </p>
        <p>
          Зачисление $ в рубли происходит по курсу ЦБ РФ на день пополнения счета, который можно <a
            href="https://www.cbr.ru/currency_base/daily/" target="_blank"><u>посмотреть здесь</u></a>.
        </p>


      </v-col>
    </v-row>


    <hr class="mt-8 mb-8" />
    <template v-for="(val, key) in customPaymentMethods" :key="key">
      <v-row md="12" v-if="val['title'][locale]">
        <v-col cols="12">
          <div class="text-h6">{{ val['title'][locale] }}</div>

          <div class="font-italic" v-if="val['note'][locale]">{{ val['note'][locale] }}</div>
          <div class="ma-4" v-if="val['fee'] != null">{{ $t('billing.invoice_request.service_fee') }}: <strong>{{
            val['fee'] }}%</strong></div>
          <div class="ma-4 v-html-content" v-if="val['html'][locale]" v-html="val['html'][locale]"></div>

        </v-col>
      </v-row>
    </template>

  </v-container>
</template>

<script setup>

import { useUserStore } from '~/stores/user'
const stateUser = useUserStore()
const { locale } = useI18n();
import { ref, reactive, onMounted } from 'vue';
let monthly_charges = reactive({});
let charges = ref([]);
let payments = ref([]);
let customPaymentMethods = reactive({});
const config = useRuntimeConfig();

onMounted(() => {
  getCustomPaymentMethods();
  getMonthlyTotalCharge();
  getUserCharges();
  getUserPayments();
})

async function getMonthlyTotalCharge() {
  const ret = await fetchAuth(`${config.public.baseURL}/month_total_charge/`, {
    method: 'GET',
  });
  Object.assign(monthly_charges, ret)
}

async function getUserCharges() {
  const ret = await fetchAuth(`${config.public.baseURL}/payments/`, {
    method: 'GET',
  });
  payments.value = ret.payments;
}

async function getUserPayments() {
  const ret = await fetchAuth(`${config.public.baseURL}/charges/`, {
    method: 'GET',
  });
  let created;
  let changed = false;
  for (let i = 0; i < ret.charges.length; i++) {
    if (ret.charges[i].created != created) {
      created = ret.charges[i].created;
      changed = !changed;
    }
    ret.charges[i].another_day = changed;
  }
  charges.value = ret.charges;
}

async function getCustomPaymentMethods() {

  const paymentMethods = await fetchAuth(`${config.public.baseURL}/custom_payment_methods/`, {
    method: 'GET',
  });

  Object.assign(customPaymentMethods, paymentMethods)

}

</script>
