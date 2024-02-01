<template>
    <v-container>
        <v-tabs v-model="tab" bg-color="deep-purple-accent-4" centered stacked grow>
            <v-tab value="app_info">
                <v-icon>mdi-information</v-icon>
                {{ $t('app.tabs.info') }}
            </v-tab>

            <v-tab value="app_design">
                <v-icon>mdi-palette</v-icon>
                {{ $t('app.tabs.design') }}
            </v-tab>

            <v-tab value="app_radios">
                <v-icon>mdi-radio</v-icon>
                {{ $t('app.tabs.radios') }}
            </v-tab>
        </v-tabs>


        <v-window v-model="tab">
            <!-- APP INFO -->
            <v-window-item value="app_info">
                <AppInfo />
            </v-window-item>

            <!-- APP DESIGN -->
            <v-window-item value="app_design">
                <AppDesign />
            </v-window-item>

            <!-- APP RADIOS -->
            <v-window-item value="app_radios">
                <AppRadios />
            </v-window-item>

        </v-window>


    </v-container>

    <v-snackbar v-model="appRequesFailed" color="error">
        {{ $t('app.request_failed') }}

        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="appRequesFailed = false">
                {{ $t('close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref } from 'vue';

    let tab = ref("app_info");
</script>
