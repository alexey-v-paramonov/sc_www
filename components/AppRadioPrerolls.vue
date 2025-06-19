    <template>

        <v-card>
            <v-toolbar color="primary" dark>
                <v-btn icon @click="$emit('close')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('app.radio.preroll.title') }} {{ appData.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn variant="text" @click="$emit('close')">
                        {{ $t('close') }}
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>

                <div class="mb-2">{{ $t('app.radio.preroll.description') }}</div>
                <div v-if="1">
                    <div class="text-h6 mb-2">{{ $t('app.radio.preroll.date_range') }}</div>
                    <div class="d-flex flex-wrap align-center gap-4">
                        <v-menu v-model="startMenu" :close-on-content-click="false" transition="scale-transition"
                            min-width="auto" class="date-picker-wrapper">
                            <template v-slot:activator="{ props }">
                                <v-text-field density="compact" :model-value="formatDate(startDate)"
                                    :label="$t('app.radio.preroll.start_date')" prepend-icon="mdi-calendar" readonly
                                    v-bind="props"></v-text-field>
                            </template>

                            <v-date-picker v-model="startDate" @update:model-value="startMenu = false" type="date"
                                density="compact"></v-date-picker>
                        </v-menu>
                        <v-menu v-model="endMenu" :close-on-content-click="false" transition="scale-transition"
                            min-width="auto" class="date-picker-wrapper">
                            <template v-slot:activator="{ props }">
                                <v-text-field density="compact" :model-value="formatDate(endDate)"
                                    :label="$t('app.radio.preroll.end_date')" prepend-icon="mdi-calendar" readonly
                                    v-bind="props"></v-text-field>
                            </template>
                            <v-date-picker v-model:model-value="endDate" @update:model-value="endMenu = false"
                                type="date" density="compact"></v-date-picker>
                        </v-menu>
                    </div>
                    <div class="mb-2">{{ $t('app.radio.preroll.description_stats') }}</div>

                </div>
                <div class="text-h6 mb-2">{{ $t('app.radio.preroll.list_title') }}</div>
                <v-table>
                    <thead>
                        <tr>
                            <th>{{ $t('app.radio.preroll.filename') }}</th>
                            <th>{{ $t('app.radio.preroll.impressions') }}</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="preRolls && preRolls.length > 0" v-for="(preroll, idx) in preRolls" :key="preroll.id">
                            <td>
                                <a :href="preroll.file" target="_blank">{{ preroll.filename }}</a> <br />
                                <audio controls>
                                    <source :src="preroll.file" type="audio/mpeg">
                                </audio>
                            </td>
                            <td>
                                {{ preroll.impressions }}
                            </td>
                            <td>
                                <v-btn density="compact" icon="mdi-delete" @click="deletePreRoll(preroll, idx)"></v-btn>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="3" class="text-center">
                                {{ $t('app.radio.preroll.empty') }}
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <div class="text-h6 mt-6 mb-2">{{ $t('app.radio.preroll.upload_title') }}</div>
                <v-form @submit.prevent="onPrerollSubmit" :disabled="isAppRadioBusy">
                    <v-file-input v-model="prerollFile.value.value" :label="$t('app.radio.preroll.select_file')"
                        accept="audio/mpeg" :disabled="isAppRadioBusy" show-size prepend-icon="mdi-music"
                        :error-messages="prerollFile.errorMessage.value" required></v-file-input>
                    <v-btn type="submit" color="primary" :loading="isAppRadioBusy"
                        :disabled="!prerollFile.value.value || isAppRadioBusy" class="mt-2" block>
                        {{ isAppRadioBusy ? $t('loading') : $t('app.radio.preroll.upload_btn') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
        <v-snackbar v-model="uploadSuccess" color="success">
            {{ $t('app.radio.preroll.upload_success') }}

            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="uploadSuccess = false">
                    {{ $t('close') }}
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar v-model="uploadFailed" color="error">
            {{ $t('app.radio.preroll.upload_failed') }}

            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="uploadFailed = false">
                    {{ $t('close') }}
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar v-model="deletePrerollSuccess" color="success">
            {{ $t('app.radio.preroll.delete_success') }}

            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="deletePrerollSuccess = false">
                    {{ $t('close') }}
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar v-model="deletePrerollFailed" color="error">
            {{ $t('app.radio.preroll.delete_failed') }}

            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="deletePrerollFailed = false">
                    {{ $t('close') }}
                </v-btn>
            </template>
        </v-snackbar>

    </template>
<script setup>
import { ref, watch } from 'vue';
import { useField, useForm } from 'vee-validate';
const props = defineProps({ platform: String, id: Number, appData: Object })
const config = useRuntimeConfig();
const uploadSuccess = ref(false);
const uploadFailed = ref(false);
const deletePrerollSuccess = ref(false);
const deletePrerollFailed = ref(false);
const startMenu = ref(false);
const endMenu = ref(false);
const startDate = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
const endDate = ref(new Date());
const prerollFile = useField('preroll', "size:3000|mimes:audio/mpeg");

function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

watch([startDate, endDate], () => {
    refresh();
});

const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});

const getPrerollUrl = () => {
    const base = `${config.public.baseURL}/mobile_apps/${props.platform}/${props.appData.id}/radios/${props.id}/prerolls/`;
    const params = [];
    if (startDate.value) params.push(`start_date=${encodeURIComponent(startDate.value.toISOString().split('T')[0])}`);
    if (endDate.value) params.push(`end_date=${encodeURIComponent(endDate.value.toISOString().split('T')[0])}`);
    return params.length ? `${base}?${params.join('&')}` : base;
};

const { data: preRolls, pending, error, refresh } = await useFetchAuth(getPrerollUrl);

async function savePrerollRequest(values) {
    let formData = new FormData();
    formData.append('radio', props.id);
    formData.append('file', values.preroll[0]);
    return await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.appData.id}/radios/${props.id}/prerolls/`, {
        method: 'POST',
        body: formData
    });
}

const onPrerollSubmit = handleSubmit(async values => {
    console.log('onPrerollSubmit', values);

    let response;
    try {
        response = await savePrerollRequest(values);
    }
    catch (e) {
        const errorData = e.data;
        if (typeof errorData == 'object') {
            for (const [field, errors] of Object.entries(errorData)) {
                for (const errCode of errors) {
                    setErrors({ [field]: t(`app.errors.${field}.${errCode}`) })
                }
            }
        }
        uploadFailed.value = true;
        return;
    }
    uploadSuccess.value = true;
    refresh();
    resetPrerollForm();
});

function resetPrerollForm() {
    // prerollFile.value.value = null;
    prerollFile.resetField();
}

function deletePreRoll(preroll, idx) {
    fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.appData.id}/radios/${props.id}/prerolls/${preroll.id}/`, { method: 'DELETE' }).then(
        () => {
            deletePrerollSuccess.value = true;
            refresh();
        },
        () => {
            deletePrerollFailed.value = true;
        }
    );
}

</script>

<style scoped>
.date-picker-wrapper {
    transform: scale(0.7);
    /* Shrink to 80% */
    transform-origin: top left;
    width: fit-content;
}
</style>