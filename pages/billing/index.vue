<template>
    <v-container>
      <v-row no-gutters md="12">
        <v-col cols="6" class="text-center" >{{ $t('billing.balance') }}</v-col>
        <v-col cols="6" class="text-center" >{{stateUser.user.userData.balance}} {{ $t('currency')}}</v-col>
      </v-row>
    </v-container>
  </template>
  
<script setup>

import { useUserStore } from '~/stores/user'
const stateUser = useUserStore()

</script>
