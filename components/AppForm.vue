<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <p class="font-weight-bold">
                    {{ $t('app.status') }}:
                </p>
            </v-col>
            <v-col cols="10">
                <template v-if="appData.missing_parts.length > 0">
                    {{ $t('app.missing_parts') }}
                    <div class="d-flex justify-center ga-2 mt-2">

                        <v-chip color="secondary" variant="flat" v-for="missing_code in appData.missing_parts">
                            {{ $t('app.missing.' + missing_code) }}
                        </v-chip>
                    </div>
                </template>
                <template v-else>


                    <v-chip v-if="appData.status == 0" variant="flat" color="default">{{ $t('app.buil_status.default') }}</v-chip>
                    <v-chip v-if="appData.status == 1" variant="flat" color="primary">{{ $t('app.buil_status.queued') }}</v-chip>
                    <v-chip v-if="appData.status == 2" variant="flat" color="green">
                        {{ $t('app.buil_status.done') }}
                    </v-chip>
                    <v-chip v-if="appData.status == 3" variant="flat" color="red">{{ $t('app.buil_status.error') }}</v-chip>
                    <div v-if="appData.status == 2">
                        {{ $t('app.version') }}: {{ appData.version }}  {{ $t('app.build_date') }}: {{ appData.build_date }}
                        <v-btn v-if="isAndroid()" :href="apkLink" prepend-icon="mdi-download-box" color="primary">{{ $t('app.download_apk') }}</v-btn>
                        <v-btn v-if="isAndroid()" :href="aabLink" prepend-icon="mdi-download-box" color="primary">{{ $t('app.download_aab') }}</v-btn>
                        <div v-if="!isAndroid()">{{ $t('app.ios_ready') }}</div>
                    </div>                    
                    <div v-if="appData.is_paid && appData.status != 1">
                        <v-btn prepend-icon="mdi-wrench" color="primary" @click="buildApplication()">{{ $t('app.build') }}</v-btn>
                    </div>
                    <div v-if="appData.status == 1">
                        <v-btn prepend-icon="mdi-refresh" color="primary" @click="refresh()">{{ $t('app.refresh_build_status') }}</v-btn>
                    </div>

                </template>
            </v-col>

        </v-row>
        <v-spacer>&nbsp;</v-spacer>
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
                <AppRadios :platform="props.platform" :id="props.id" :app-data="appData"  @app-info-refresh="refresh()"/>
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

    <v-snackbar v-model="appBuildScheduled" color="success">
        <span v-if="isAndroid()">
            {{ $t('app.build_scheduled_android') }}
        </span>
        <span v-else>
            {{ $t('app.build_scheduled_ios') }}
        </span>

        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="appBuildScheduled = false">
                {{ $t('close') }}
            </v-btn>
        </template>
    </v-snackbar>

</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({ platform: String, id: Number })
const config = useRuntimeConfig();

let appRequesFailed = ref(false);
let appBuildScheduled = ref(false);
let tab = ref("app_info");

const apkLink = computed(() => {
    return `https://streaming.center/radio/android_app/${props.id}/${appData.value.short_package_name}.apk`;
});

const aabLink = computed(() => {
    return `https://streaming.center/radio/android_app/${props.id}/${appData.value.short_package_name}.aab`;
});

function isAndroid() {
    return props.platform = 'android';
}

async function buildApplication(){
  await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/build/`, {
    method: 'PATCH',
  });
  appBuildScheduled.value = true;
  refresh();
}

// Load app data
const { data: appData, pending, error, refresh } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/`);

if (error.value) {
    appRequesFailed.value = true;
    // router.push(`/apps/${props.platform}/`);
}

</script>
