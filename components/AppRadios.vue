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

                        <tr v-if="appRadios && appRadios.length > 0 && !pending" v-for="(appRadio, index) in appRadios"
                            :key="appRadio.id">
                            <td style="width: 100px;">
                                <img :src="appRadio.logo" class="app-image-thumbnail">
                            </td>

                            <td>
                                {{ appRadio.title }}
                            </td>
                            <td>
                                <v-btn icon="mdi-menu-up" :disabled="index == 0"
                                    @click="setOrder(appRadio, index, index - 1)"></v-btn>
                                <v-btn icon="mdi-menu-down" :disabled="index == (appRadios.length - 1)"
                                    @click="setOrder(appRadio, index, index + 1)"></v-btn>&nbsp;
                                <v-btn icon="mdi-pencil" @click="openRadioDialog(appRadio)"></v-btn>
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
        <v-btn block color="primary" prepend-icon="mdi-plus" @click="openRadioDialog();">{{ $t('app.radios.add')
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

                    <v-select v-if="is_sc_panel.value.value == '1' && (scRadios.length > 0 || sc_server_id.value.value)"
                        @update:modelValue="setRadioData" v-model="sc_server_id.value.value"
                        :hint="$t('app.radio.sc_server_id_hint')" :items="scRadios" item-title="id" item-value="id"
                        :label="$t('app.radio.sc_server_id_hint')" persistent-hint single-line></v-select>

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


                    <v-row no-gutters md="12">
                        <v-col cols="12">

                            <v-text-field v-model="title.value.value" type="text" :error-messages="title.errorMessage.value"
                                :label="$t('app.radio.title')" maxlength="150"></v-text-field>

                            <v-textarea v-model="description.value.value" :label="$t('app.radio.description')"
                                :error-messages="description.errorMessage.value" :hint="$t('app.radio.description_hint')"
                                persistent-hint></v-textarea>

                            <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_shoutbox.value.value" value="1"
                                :label="$t('app.radio.allow_shoutbox')" type="checkbox"></v-checkbox>

                            <v-row no-gutters>
                                <v-col cols="6">
                                    <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_likes.value.value"
                                        value="1" :label="$t('app.radio.allow_likes')" type="checkbox"></v-checkbox>

                                </v-col>
                                <v-col cols="6">
                                    <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_dislikes.value.value"
                                        value="1" :label="$t('app.radio.allow_dislikes')" type="checkbox"></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row no-gutters>
                        <v-col cols="12">
                            <div class="text-h5 text-center">{{ $t('app.radio.channels.title') }}</div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th>
                                            {{ $t('app.radio.channels.stream_url') }}
                                        </th>
                                        <th>
                                            {{ $t('app.radio.channels.bitrate') }}
                                        </th>
                                        <th>
                                            {{ $t('app.radio.channels.audio_format') }}
                                        </th>
                                        <th>
                                            {{ $t('app.radio.channels.server_type') }}
                                        </th>
                                        <th>
                                            &nbsp;
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="radioStreams && radioStreams.length > 0 && !pending"
                                        v-for="(stream, index) in radioStreams">
                                        <td>
                                            <a :href="stream.stream_url" target="_blank">{{ stream.stream_url }}</a>
                                        </td>

                                        <td>
                                            {{ stream.bitrate }}kbps
                                        </td>

                                        <td>
                                            {{ getAudioFormat(stream.audio_format) }}
                                        </td>

                                        <td>
                                            {{ getServerType(stream.server_type) }}
                                        </td>

                                        <td>
                                            <v-btn icon="mdi-menu-up" :disabled="index == 0"
                                                @click="setChannelOrder(index, index - 1)"></v-btn>
                                            <v-btn icon="mdi-menu-down" :disabled="index == (radioStreams.length - 1)"
                                                @click="setChannelOrder(index, index + 1)"></v-btn>&nbsp;
                                            <v-btn icon="mdi-delete" @click="deleteChannel(index)"></v-btn>
                                        </td>
                                    </tr>

                                    <tr v-else-if="pending">
                                        <td colspan="10" class="text-center"><v-progress-circular
                                                indeterminate></v-progress-circular>
                                        </td>
                                    </tr>

                                    <tr v-else>
                                        <td class="text-center" colspan="10">
                                            <br />
                                            {{ $t('app.radio.channels.empty') }}
                                            <br />
                                            <br />
                                        </td>
                                    </tr>

                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>


                    <!-- New stream form -->
                    <v-row no-gutters md="12">
                        <v-col cols="12">

                            <div class="text-h5 text-center">{{ $t('app.radio.channels.add_new_title') }}</div>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field v-model="new_channel_stream_url.value.value" type="url"
                                        :error-messages="new_channel_stream_url.errorMessage.value"
                                        maxlength="200"
                                        :label="$t('app.radio.channels.stream_url')"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="4">
                                    <v-select v-model="new_channel_bitrate.value.value"
                                        :items="BITRATES_MP3" item-title="id"
                                        item-value="id" :label="$t('app.radio.channels.bitrate')" 
                                        single-line></v-select>
                                </v-col>

                                <v-col cols="4">
                                    <v-select v-model="new_channel_audio_format.value.value"
                                        :items="AUDIO_FORMATS" item-title="title"

                                        item-value="value" :label="$t('app.radio.channels.audio_format')" 
                                        single-line></v-select>
                                </v-col>

                                <v-col cols="4">
                                    <v-select v-model="new_channel_server_type.value.value"
                                        :items="SERVER_TYPES" item-title="title"
                                        item-value="value" :label="$t('app.radio.channels.server_type')"
                                        single-line></v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row  no-gutters>
                        <v-col cols="12">
                            <v-btn :disabled="isAppRadioBusy" block class="mt-2" @click="addStream()" color="secondary">{{
                                $t('app.radio.channels.add_new') }}</v-btn>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">

                            <v-btn type="submit" :disabled="isAppRadioBusy" block class="mt-2" color="primary">{{
                                isAppRadioBusy ? $t('loading') : $t('save') }}</v-btn>
                        </v-col>
                    </v-row>

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
let radioStreams = ref([]);



const previewLogo = ref();
const AUDIO_FORMATS = [{ "value": "mp3", "title": 'MP3' }, { "value": "aac", "title": 'AAC' }, { "value": "flac", "title": 'FLAC' }];
const BITRATES_MP3 = [16, 24, 32, 48, 64, 96, 128, 160, 192, 256, 320];
const SERVER_TYPES = [{ "value": "icecast", "title": 'Icecast' }, { "value": "shoutcast", "title": 'Shoutcast' }];


const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});


const is_sc_panel = useField('is_sc_panel');
const sc_api_url = useField('sc_api_url', "url|required_if:is_sc_panel,1");
const sc_server_id = useField('sc_server_id', "required_if:is_sc_panel,1");

// required_if:is_sc_panel,1
const logo = useField('logo', "image|size:2000");

const title = useField('title', "required", { validateOnValueUpdate: false });
const description = useField('description', "required", { validateOnValueUpdate: false });
const allow_shoutbox = useField('allow_shoutbox');
const allow_likes = useField('allow_likes');
const allow_dislikes = useField('allow_dislikes');

const new_channel_stream_url = useField('new_channel_stream_url', "url");
const new_channel_bitrate = useField('new_channel_bitrate',);
const new_channel_audio_format = useField('new_channel_audio_format',);
const new_channel_server_type = useField('new_channel_server_type',);


new_channel_bitrate.value.value = 128;
new_channel_audio_format.value.value = AUDIO_FORMATS[0].value;
new_channel_server_type.value.value = SERVER_TYPES[0].value;

allow_shoutbox.value.value = "1";
allow_likes.value.value = "1";
allow_dislikes.value.value = "1";

const { data: appRadios, pending, error, refresh } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/radios/`);

function getAudioFormat(v){
    return AUDIO_FORMATS.filter((t) => t.value == v)[0].title;
}

function getServerType(v){
    return SERVER_TYPES.filter((t) => t.value == v)[0].title;
}

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

async function setOrder(radio, index, indexNew) {
    if (indexNew < 0 || indexNew >= appRadios.length) {
        return;
    }

    let appRadiosTempCopy = [...appRadios.value];
    [appRadiosTempCopy[index], appRadiosTempCopy[indexNew]] = [appRadiosTempCopy[indexNew], appRadiosTempCopy[index]];
    var appRadioIDs = appRadiosTempCopy.map(r => r.id);

    await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${radio.id}/set_radio_order/`, {
        method: 'PUT',
        body: appRadioIDs
    });

    refresh();

}


function setChannelOrder(index, indexNew) {
    if (indexNew < 0 || indexNew >= radioStreams.value.length) {
        return;
    }
    [radioStreams.value[index], radioStreams.value[indexNew]] = [radioStreams.value[indexNew], radioStreams.value[index]];

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


function openRadioDialog(r = null) {
    if (r) {
        console.log(r.id);
        appRadio.value = { ...r }
        title.value.value = r.title;
        description.value.value = r.description;
        is_sc_panel.value.value = r.sc_api_url ? "1" : null;
        if (is_sc_panel.value.value) {
            sc_api_url.value.value = r.sc_api_url;
            sc_server_id.value.value = r.sc_server_id;
            allow_shoutbox.value.value = r.allow_shoutbox ? '1' : null;
            allow_likes.value.value = r.allow_likes ? '1' : null;
            allow_dislikes.value.value = r.allow_dislikes ? '1' : null;
        }
        radioStreams.value = [...r.channels];

    }
    else {
        resetRadioForm();
    }
    radioDialog.value = true;
}

function resetRadioForm(){
    title.value.value = '';
    description.value.value = '';
    is_sc_panel.value.value = null;
    logo.value.value = '';
    sc_api_url.value.value = '';
    sc_server_id.value.value = '';
    new_channel_bitrate.value.value = 128;
    new_channel_audio_format.value.value = AUDIO_FORMATS[0].value;
    new_channel_server_type.value.value = SERVER_TYPES[0].value;
    radioStreams.value = [];

}

function deleteRadio(r) {
    delDialog.value = true;
    new Promise((resolve) => {
        answerDialog = resolve;
    }).then((res) => {
        delDialog.value = false;
        if (res) {
            fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/radios/${r.id}/`, { method: 'DELETE' }).then(
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

function deleteChannel(channel_index){
    radioStreams.value.splice(channel_index, 1);
}

function addStream() {
    radioStreams.value.push({
        stream_url: new_channel_stream_url.value.value,
        // stream_url_fallback: new_channel_stream_url_fallback,
        bitrate: new_channel_bitrate.value.value,
        audio_format: new_channel_audio_format.value.value,
        server_type: new_channel_server_type.value.value,
    });
}

function isScRadio(){
    return is_sc_panel.value.value == '1';
}

async function saveAppRadioRequest(values) {
    const isEditMode = Boolean(appRadio.value.id);
    let formData = new FormData();

    formData.append('app', appData.id);
    formData.append('title', values.title);
    formData.append('description', values.description);
    values.logo && formData.append('logo', values.logo[0]);
    if(isScRadio()){
        formData.append('sc_api_url', sc_api_url.value.value);
        formData.append('sc_server_id', sc_server_id.value.value);
        formData.append('allow_shoutbox', allow_shoutbox.value.value == '1');
        formData.append('allow_likes', allow_likes.value.value == '1');
        formData.append('allow_dislikes', allow_dislikes.value.value == '1');

    }
    else{
        formData.append('sc_api_url', '');
        formData.append('sc_server_id', '');
        formData.append('allow_shoutbox', false);
        formData.append('allow_likes', false);
        formData.append('allow_dislikes', false);
    }
    // formData.append('channels', JSON.stringify(radioStreams.value));
    var blob = new Blob([JSON.stringify(radioStreams.value)], {type: "application/json"});
    console.log("Channels: ", JSON.stringify(radioStreams.value))
    formData.append('channels', blob);


    return await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/radios/` + (isEditMode? appRadio.value.id + '/' : ''), {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData
    });
}


const onAppRadioSubmit = handleSubmit(async values => {
    console.log("Submit: ", values);

    let response;
    try {
        response = await saveAppRadioRequest(values);
        console.log(response);
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
        return;
    }
    refresh();
    resetRadioForm();

    radioDialog.value = false;
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
