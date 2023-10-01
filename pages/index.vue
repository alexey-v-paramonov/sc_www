<template>
    <v-container>
      <v-row no-gutters md="6">
        <v-col>User area <NuxtLink to="/radio/wizard">{{ $t('radio.wizard') }}</NuxtLink>
        
        </v-col>
      </v-row>
    </v-container>
  </template>
  
<script setup>
import { useUserStore } from '@/stores/user.js';

definePageMeta({
  layout: "default",
  middleware: 'auth',
});

const userStore = useUserStore();

</script>
