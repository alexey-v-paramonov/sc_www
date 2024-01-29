<template>
    <v-row no-gutters md="12" v-if="pending">
        <v-col>
            <v-progress-circular indeterminate></v-progress-circular>
        </v-col>
    </v-row>

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

const config = useRuntimeConfig();
const props = defineProps({ platform: String, id: Number })
// const router = useRouter();

let appData = reactive({});
let appRequesFailed = ref(false);

const { data, pending, error } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/`);
appData.value = data.value || {};

if (error.value) {
    appRequesFailed.value = true;
    // router.push(`/apps/${props.platform}/`);
}


</script>