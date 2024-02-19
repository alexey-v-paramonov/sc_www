<template>
  <v-app>
    <v-row no-gutters>
      <v-col class="text-center pt-15 ma-2">
        <v-img class="mx-auto" :width="200" src="/img/logo_trans.png"></v-img>
      </v-col>
      <v-col>
        <slot />
      </v-col>
    </v-row>

    <v-footer border class="text-center" :app="true">
      <p class="text-right">{{ $t('copyright') }}</p>
    </v-footer>

  </v-app>
</template>