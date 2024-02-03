<template>
    <v-container>
        <v-row>
            <v-col md="12">
                <div class="text-h5">{{ $t('app.radios.title') }}</div>
                <div class="text-caption">{{ $t('app.radios.description') }}</div>
            </v-col>
        </v-row>
        <v-row no-gutters md="12">
            <v-col>
                <v-table>
                    <thead>
                        <tr>
                            <th>
                                &nbsp;
                            </th>
                            <th class="text-left">
                                {{ $t('app.radio.title') }}
                            </th>
                            <th>
                                &nbsp;
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-if="appRadios.length > 0 && !pending" v-for="appRadio in appRadios" :key="appRadio.id">
                            <td style="width: 100px;">
                                <img :src="appRadio.logo" class="app-image-thumbnail">
                            </td>

                            <td>
                                {{ appRadio.title }}
                            </td>
                            <td>
                                <v-btn icon="mdi-pencil"></v-btn>
                                <v-btn icon="mdi-delete" @click="deleteRadio(appRadio)"></v-btn>
                            </td>
                        </tr>

                        <tr v-else-if="pending">
                            <td colspan="10" class="text-center"><v-progress-circular indeterminate></v-progress-circular>
                            </td>
                        </tr>

                        <tr v-else>
                            <td class="text-center" colspan="3">
                                <br />
                                {{ $t('app.radios.empty') }}
                                <br />
                                <br />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        <v-btn block color="primary" prepend-icon="mdi-plus" @click="radioDialog = true">{{ $t('app.radios.add')
        }}</v-btn>

    </v-container>

    <v-dialog v-model="radioDialog" fullscreen>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="radioDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('app.radio.toolbar') }} {{ appData.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn variant="text" @click="radioDialog = false">
                        {{ $t('close') }}
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <v-form @submit.prevent="onAppRadioSubmit" :disabled="isAppRadioBusy">

                    <v-checkbox v-model="is_sc_panel.value.value" value="1" :label="$t('app.radio.is_sc_panel')"
                        type="checkbox"></v-checkbox>

                    <v-text-field v-if="is_sc_panel.value.value == '1'" v-model="sc_api_url.value.value" type="url"
                        @change="checkSCPanelURL()" :error-messages="sc_api_url.errorMessage.value" name="sc_api_url"
                        :label="$t('app.radio.sc_api_url')" :hint="$t('app.radio.sc_api_url_hint')"
                        persistent-hint></v-text-field>

                    <v-select v-if="is_sc_panel.value.value == '1' && scRadios.length > 0" @update:modelValue="setRadioData"
                        v-model="sc_server_id.value.value" :hint="$t('app.radio.sc_server_id_hint')" :items="scRadios"
                        item-title="id" item-value="id" :label="$t('app.radio.sc_server_id_hint')" persistent-hint
                        single-line></v-select>

                    <!-- Logo -->
                    <v-row no-gutters md="12">
                        <v-col cols="6" class="text-center">
                            <img v-if="appRadio.logo || previewLogo" :src="previewLogo ? previewLogo : appRadio.logo"
                                class="app-image-preview" />
                            <v-icon v-else icon="mdi-camera" size="x-large" style="font-size: 100px;"></v-icon>
                        </v-col>
                        <v-col cols="6">
                            <v-file-input prepend-icon="mdi-image" show-size :label="$t('app.radio.logo')"
                                @change="generateLogoPreview()" @click:clear="generateLogoPreview()" name="logo"
                                v-model="logo.value.value" :error-messages="logo.errorMessage.value" accept="image/png"
                                :hint="$t('app.radio.logo_hint')" persistent-hint></v-file-input>
                        </v-col>
                    </v-row>



                    <v-text-field v-model="title.value.value" type="text" :error-messages="title.errorMessage.value"
                        :label="$t('app.radio.title')" maxlength="150"></v-text-field>
                    <v-textarea v-model="description.value.value" :label="$t('app.radio.description')"
                        :error-messages="description.errorMessage.value" :hint="$t('app.radio.description_hint')"
                        persistent-hint></v-textarea>

                    <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_shoutbox.value.value" value="1"
                        :label="$t('app.radio.allow_shoutbox')" type="checkbox"></v-checkbox>

                    <v-row no-gutters md="12">
                        <v-col cols="6">
                            <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_likes.value.value" value="1"
                                :label="$t('app.radio.allow_likes')" type="checkbox"></v-checkbox>

                        </v-col>
                        <v-col cols="6">
                            <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_dislikes.value.value" value="1"
                                :label="$t('app.radio.allow_dislikes')" type="checkbox"></v-checkbox>
                        </v-col>
                    </v-row>

                    <v-btn type="submit" :disabled="isAppRadioBusy" block class="mt-2" color="primary">{{
                        isAppRadioBusy ? $t('loading') : $t('save') }}</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
        <v-btn color="primary" block @click="radioDialog = false">{{ $t('close') }}</v-btn>
    </v-dialog>

    <v-dialog v-model="delDialog" width="auto">
        <v-card>
            <v-card-text>
                <div class="py-12 text-center">
                    <v-icon class="mb-6" color="error" icon="mdi-alert-decagram" size="128"></v-icon>

                    <div class="text-h4 font-weight-bold">{{ $t('app.radios.delete_confirmation') }}</div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" color="grey" @click="answerDialog(false)">{{ $t('cancel') }}</v-btn>
                <v-btn variant="outlined" color="primary" @click="answerDialog(true)">{{ $t('delete') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-snackbar v-model="deleteRadioFailed" color="error">
        {{ $t('app.radios.delete_failed') }}

        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="deleteRadioFailed = false">
                {{ $t('close') }}
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="deleteRadioSuccess" color="success">
        {{ $t('app.radios.delete_success') }}

        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="deleteRadioSuccess = false">
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
const { locale, t } = useI18n();

let appData = reactive(props.appData);
let radioDialog = ref(false);
// let appRadios = ref([]);
let scRadios = ref([]);
const appRadio = ref({});
const delDialog = ref(false);
let answerDialog = ref();
const deleteRadioSuccess = ref(false);
const deleteRadioFailed = ref(false);


const previewLogo = ref();

const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});


const is_sc_panel = useField('is_sc_panel');
const sc_api_url = useField('sc_api_url', "url|required_if:is_sc_panel,1");
const sc_server_id = useField('sc_server_id', "required_if:is_sc_panel,1");

const logo = useField('logo', "image|size:2000");

const title = useField('title', "required");
const description = useField('description', "required");
const allow_shoutbox = useField('allow_shoutbox');
const allow_likes = useField('allow_likes');
const allow_dislikes = useField('allow_dislikes');

allow_shoutbox.value.value = "1";
allow_likes.value.value = "1";
allow_dislikes.value.value = "1";

const { data: appRadios, pending, error, refresh } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/radio/${props.platform}/`);


function setRadioData(v) {
    const id = v || sc_server_id.value.value;
    let radio = scRadios.value.find(r => r.id === id);
    if (radio.title) {
        title.value.value = radio.title;
    }
    if (radio.description) {
        description.value.value = radio.description;
    }
}

async function generateLogoPreview() {
    const { valid } = await logo.validate();
    previewLogo.value = valid && logo.value.value[0] ? URL.createObjectURL(logo.value.value[0]) : undefined;
}

async function checkSCPanelURL() {

    scRadios.value = [];
    try {
        scRadios.value = await $fetch(`${sc_api_url.value.value}/api/v2/servers/`);
    }
    catch (e) {

    }
    if (!scRadios.value || !scRadios.value.length) {
        setErrors({ 'sc_api_url': t(`app.radio.errors.invalid_sc_url`) })
        return;
    }
    sc_server_id.value.value = scRadios.value[0].id;
    setRadioData();
}


function deleteRadio(r) {
    delDialog.value = true;
    new Promise((resolve) => {
        answerDialog = resolve;
    }).then((res) => {
        delDialog.value = false;
        if (res) {
            fetchAuth(`${config.public.baseURL}/mobile_apps/radio/${props.platform}/${r.id}/`, { method: 'DELETE' }).then(
                () => {
                    deleteRadioSuccess.value = true;
                    refresh();
                },
                () => {
                    deleteRadioFailed.value = true;
                }
            );
        }
    })
}

async function saveAppRadioRequest(values) {
    let formData = new FormData();

    formData.append('app', appData.id);
    formData.append('title', values.title);
    // formData.append('user', stateUser.user.id);
    formData.append('description', values.description);
    //formData.append('description_short', values.description_short);
    //values.website_url && formData.append('website_url', values.website_url);
    //formData.append('email', values.email);
    // values.icon && formData.append('icon', values.icon[0]);
    values.logo && formData.append('logo', values.logo[0]);

    return await useFetchAuth(`${config.public.baseURL}/mobile_apps/radio/${props.platform}/`, {
        method: 'POST',
        body: formData
    });
}


const onAppRadioSubmit = handleSubmit(async values => {

    let response;
    try {
        response = await saveAppRadioRequest(values);
        console.log(response);
    }
    catch (e) {
        console.log("Exception: ", e)
        const errorData = e.data;
        for (const [field, errors] of Object.entries(errorData)) {
            for (const errCode of errors) {
                setErrors({ [field]: t(`app.errors.${field}.${errCode}`) })
            }
        }
        return;
    }
    refresh();
    radioDialog.value = false;
    logo.value.value = '';
});


</script>
<style scoped>
.app-image-preview {
    max-height: 200px;
    max-width: 200px;
}

.app-image-thumbnail {
    max-height: 100px;
    max-width: 100px;
}
</style>
