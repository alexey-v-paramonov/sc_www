
<template>
  <v-container>
    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h6">Пополнить счёт через ЮKassa</div>
        <p class="font-italic">Оплата только картами РФ, после оплаты Вы получите чек</p>
        <p>Комиссия сервиса: <strong>0%</strong></p>
      </v-col>
    </v-row>
    <v-row no-gutters md="12">
      <v-col md="12">
        <v-form action="https://yoomoney.ru/eshop.xml" method="POST">

          <v-text-field v-model="amount.value.value" type="number" :error-messages="amount.errorMessage.value"
            label="Сумма пополнения, минимум 100 рублей" name="sum" @change="generateReceipt()"></v-text-field>

          <input type="hidden" name="paymentType" value="">
          <input type="hidden" name="shopId" value="55810">
          <input type="hidden" name="scid" value="52660">
          <input type="hidden" name="customerNumber" :value="customerNumber">
          <input type="hidden" name="paymentType" value="">
          <input type="hidden" name="InvId" :value="invID">
          <input name="ym_merchant_receipt" id="ym_merchant_receipt" :value="receipt" type="hidden" />

          <v-btn type="submit" block class="mt-2" color="primary">Перейти к оплате</v-btn>
        </v-form>
      </v-col>
    </v-row>

  </v-container>
</template>


<script setup>
import { useField, useForm } from 'vee-validate';
import { useUserStore } from '@/stores/user.js';
import { ref, onMounted } from 'vue';

const receipt = ref('');

const stateUser = useUserStore()
let customerNumber = stateUser.user.id;
let invID = parseInt(new Date().getTime() / 1000);

definePageMeta({
  layout: "default",
});

useForm({
  initialValues: {
    email: stateUser.user.email,
    amount: 1000,
  },
});

const amount = useField('amount', "required|min_value:100");

function generateReceipt() {
  receipt.value = JSON.stringify({
    "customerContact": stateUser.user.email,
    "taxSystem": 2,
    "items": [{
      "quantity": 1,
      "price": {
        "amount": amount.value.value,
      },
      "tax": 1,
      "text": "Право использования сервиса Радио-Точка",
      "paymentMethodType": "full_prepayment",
      "paymentSubjectType": "service"
    }]
  });
}

onMounted(() => {
  generateReceipt();
});

</script>