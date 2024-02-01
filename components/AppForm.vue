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

        <v-row no-gutters md="12" v-if="pending">
            <v-col>
                <v-progress-circular indeterminate></v-progress-circular>
            </v-col>
        </v-row>
        <v-window v-model="tab" v-if="!pending">
            <!-- APP INFO -->
            <v-window-item value="app_info">
                <AppInfo :platform="props.platform" :id="props.id" :app-data="appData" @app-info-refresh="refresh()" />
            </v-window-item>

            <!-- APP DESIGN -->
            <v-window-item value="app_design">
                <AppDesign :platform="props.platform" :id="props.id" :app-data="appData" />
            </v-window-item>

            <!-- APP RADIOS -->
            <v-window-item value="app_radios">
                <AppRadios :id="props.id" />
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
import { ref, reactive } from 'vue';
const props = defineProps({ platform: String, id: Number })
const config = useRuntimeConfig();
// const router = useRouter();

let appRequesFailed = ref(false);
let tab = ref("app_info");
// let appData = reactive({});

// Load app data
const { data: appData, pending, error, refresh } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/`);
// appData.value = data.value || {};

if (error.value) {
    appRequesFailed.value = true;
    // router.push(`/apps/${props.platform}/`);
}

</script>
