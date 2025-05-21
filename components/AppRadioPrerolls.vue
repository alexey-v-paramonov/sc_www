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

                <div class="text-h6 mb-2">{{ $t('app.radio.preroll.list_title') }}</div>
                <v-table>
                    <thead>
                        <tr>
                            <th>{{ $t('app.radio.preroll.filename') }}</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="preRolls && preRolls.length > 0" v-for="(preroll, idx) in preRolls" :key="preroll.id">
                            <td>
                                <a :href="preroll.file" target="_blank">{{ baseName(preroll.file) }}</a> <br />
                                <audio controls>
                                    <source :src="preroll.file" type="audio/mpeg">
                                </audio>
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
                        required></v-file-input>
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
import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';
const props = defineProps({ platform: String, id: Number, appData: Object })
const config = useRuntimeConfig();
const uploadSuccess = ref(false);
const uploadFailed = ref(false);
const deletePrerollSuccess = ref(false);
const deletePrerollFailed = ref(false);


const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});

const prerollFile = useField('preroll', "size:3000|mimes:audio/mpeg");
const { data: preRolls, pending, error, refresh } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.appData.id}/prerolls/`);

function baseName(path) {
    return path.split('/').pop();
};

async function savePrerollRequest(values) {
    let formData = new FormData();
    formData.append('radio', props.id);
    formData.append('file', values.preroll[0]);
    return await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.appData.id}/prerolls/`, {
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
    fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.appData.id}/prerolls/${preroll.id}/`, { method: 'DELETE' }).then(
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