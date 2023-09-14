<template>
    <v-container>
      <v-row no-gutters md="6">
        <v-col>User area2</v-col>
        <v-col md="6">
          User text
        </v-col>
      </v-row>
    </v-container>
  </template>
  
<script setup>

definePageMeta({
  layout: "default",
  middleware: 'auth',
});

</script>
