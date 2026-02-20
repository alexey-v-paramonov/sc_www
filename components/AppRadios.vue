<template>
    <v-container>
        <v-row md="12">
            <v-col cols="12">
                <v-alert type="info">{{ $t('app.radios.changes_update') }}</v-alert>
            </v-col>
        </v-row>

        <v-row>
            <v-col md="12">
                <div class="text-h5">{{ $t('app.radios.title') }}</div>
                <div class="text-caption">{{ $t('app.radios.description') }}</div>
            </v-col>
        </v-row>
        <v-row md="12">
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
                                &nbsp;{{ $t('actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-if="appRadios && appRadios.length > 0 && !pending" v-for="(appRadio, index) in appRadios"
                            :key="appRadio.id">
                            <td style="width: 100px;" class="pa-2" @click="openRadioDialog(appRadio)">
                                <img :src="appRadio.logo" class="app-image-thumbnail">
                            </td>

                            <td @click="openRadioDialog(appRadio)">
                                {{ appRadio.title }}
                            </td>
                            <td class="text-no-wrap" :style="display.smAndUp ? 'width: 240px' : ''">
                                <v-btn v-if="display.smAndUp" variant="tonal" size="x-small" class="mr-2"
                                    icon="mdi-menu-up" :disabled="index == 0"
                                    @click="setOrder(appRadio, index, index - 1)"></v-btn>
                                <v-btn v-if="display.smAndUp" variant="tonal" size="x-small" icon="mdi-menu-down"
                                    :disabled="index == (appRadios.length - 1)"
                                    @click="setOrder(appRadio, index, index + 1)"></v-btn>&nbsp;
                                <v-btn density="compact" icon="mdi-pencil" @click="openRadioDialog(appRadio)"></v-btn>
                                <v-btn density="compact" icon="mdi-volume-high" @click="openPrerollDialog(appRadio)"
                                    :title="$t('app.radio.preroll.list_title')"></v-btn>
                                <v-btn density="compact" icon="mdi-delete" @click="deleteRadio(appRadio)"></v-btn>
                            </td>
                        </tr>

                        <tr v-else-if="pending">
                            <td colspan="10" class="text-center"><v-progress-circular
                                    indeterminate></v-progress-circular>
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
        <v-btn block class="mt-2" color="primary" prepend-icon="mdi-plus" @click="openRadioDialog();">{{
            $t('app.radios.add')
            }}</v-btn>

    </v-container>

    <!-- Pre-roll Management Dialog -->
    <v-dialog v-model="preRollDialog" fullscreen>
        <AppRadioPrerolls :platform="props.platform" :id="appRadio.id" :app-data="appData"
            @close="preRollDialog = false" />
    </v-dialog>


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
                        @change="checkSCPanelURL(true)" :error-messages="sc_api_url.errorMessage.value"
                        name="sc_api_url" :label="$t('app.radio.sc_api_url')" :hint="$t('app.radio.sc_api_url_hint')"
                        persistent-hint></v-text-field>

                    <v-select v-if="is_sc_panel.value.value == '1' && (scRadios.length > 0 || sc_server_id.value.value)"
                        @update:modelValue="setRadioData" v-model="sc_server_id.value.value"
                        :hint="$t('app.radio.sc_server_id_hint')" :items="scRadios" item-title="id_title"
                        item-value="id" :label="$t('app.radio.sc_server_id_hint')" persistent-hint
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


                    <v-row no-gutters md="12">
                        <v-col cols="12">

                            <v-text-field v-model="title.value.value" type="text"
                                :error-messages="title.errorMessage.value" :label="$t('app.radio.title')"
                                maxlength="150"></v-text-field>

                            <v-textarea v-model="description.value.value" :label="$t('app.radio.description')"
                                :error-messages="description.errorMessage.value"
                                :hint="$t('app.radio.description_hint')" persistent-hint></v-textarea>

                            <v-row no-gutters>
                                <v-col cols="6">
                                    <v-checkbox v-if="is_sc_panel.value.value == '1'"
                                        v-model="allow_shoutbox.value.value" value="1"
                                        :label="$t('app.radio.allow_shoutbox')" type="checkbox"></v-checkbox>
                                </v-col>
                                <v-col cols="6">

                                    <v-checkbox v-if="is_sc_panel.value.value == '1'"
                                        v-model="allow_history.value.value" value="1"
                                        :label="$t('app.radio.allow_history')" type="checkbox"></v-checkbox>
                                </v-col>

                            </v-row>

                            <v-row no-gutters>
                                <v-col cols="6">
                                    <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_likes.value.value"
                                        value="1" :label="$t('app.radio.allow_likes')" type="checkbox"></v-checkbox>

                                </v-col>
                                <v-col cols="6">
                                    <v-checkbox v-if="is_sc_panel.value.value == '1'"
                                        v-model="allow_dislikes.value.value" value="1"
                                        :label="$t('app.radio.allow_dislikes')" type="checkbox"></v-checkbox>
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
                                            <span v-if="stream.server_type == 'hls'">-</span>
                                            <span v-else>{{ stream.bitrate }}kbps</span>
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

                                            <v-alert v-if="noChannels" color="error" closable border="start"
                                                icon="mdi-message-alert"
                                                :text="$t('app.radio.channels.empty')"></v-alert>

                                            <p v-else>
                                                {{ $t('app.radio.channels.empty') }}
                                            </p>

                                            <br />
                                            <br />
                                        </td>
                                    </tr>

                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>

                    <v-row no-gutters md="12" v-if="sc_api_url.value.value && sc_server_id.value.value">
                        <v-col cols="9">&nbsp;</v-col>
                        <v-col cols="3">
                            <v-btn :disabled="isAppRadioBusy" block class="mt-2" @click="syncStreams()"
                                color="secondary">
{{
                                    $t('app.radio.channels.sync_with_panel') }}</v-btn>
                        </v-col>
                    </v-row>


                    <!-- New stream form -->
                    <v-row no-gutters md="12">
                        <v-col cols="12">

                            <div class="text-h5 text-center">{{ $t('app.radio.channels.add_new_title') }}</div>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field v-model="new_channel_stream_url.value.value" type="url"
                                        :error-messages="new_channel_stream_url.errorMessage.value" maxlength="200"
                                        name="new_channel_stream_url"
                                        :label="$t('app.radio.channels.stream_url')"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="4" v-if="new_channel_server_type.value.value != 'hls'">
                                    <v-select v-model="new_channel_bitrate.value.value" :items="BITRATES_MP3"
                                        item-title="id" item-value="id" :label="$t('app.radio.channels.bitrate')"
                                        single-line></v-select>
                                </v-col>

                                <v-col cols="4">
                                    <v-select v-model="new_channel_audio_format.value.value" :items="AUDIO_FORMATS"
                                        item-title="title" item-value="value"
                                        :label="$t('app.radio.channels.audio_format')" single-line></v-select>
                                </v-col>

                                <v-col cols="4">
                                    <v-select v-model="new_channel_server_type.value.value" :items="SERVER_TYPES"
                                        item-title="title" item-value="value"
                                        :label="$t('app.radio.channels.server_type')" single-line></v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-btn :disabled="isAppRadioBusy" block class="mt-2" @click="addStream()"
                                color="secondary">{{
                                    $t('app.radio.channels.add_new') }}</v-btn>
                        </v-col>
                    </v-row>


                    <!-- Social links -->
                    <v-row no-gutters>
                        <v-col cols="12">
                            <div class="text-h5 text-center">{{ $t('app.radio.social_links.title') }}</div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th>
                                            {{ $t('app.radio.social_links.type') }}
                                        </th>
                                        <th>
                                            {{ $t('app.radio.social_links.link_title') }}
                                        </th>
                                        <th>
                                            {{ $t('app.radio.social_links.value') }}
                                        </th>
                                        <th>
                                            &nbsp;
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="socialLinks && socialLinks.length > 0 && !pending"
                                        v-for="(social_link, index) in socialLinks">
                                        <td>
                                            <img :src="'/img/social_icons/' + social_link.type + '.svg'"
                                                style="vertical-align:middle;" width="32" height="32" />
                                            {{ getSocialLinkTitle(social_link.type) }}
                                        </td>

                                        <td>
                                            {{ social_link.title }}
                                        </td>

                                        <td>
                                            <span v-if="social_link.type == 'phone'">
                                                <a :href="'tel:' + social_link.value">{{ social_link.value }}</a>
                                            </span>
                                            <span v-else-if="social_link.type == 'email'">
                                                <a :href="'mailto:' + social_link.value">{{ social_link.value }}</a>
                                            </span>
                                            <span v-else>
                                                <a :href="social_link.value" target="_blank">{{ social_link.value }}</a>
                                            </span>
                                        </td>

                                        <td>
                                            <v-btn icon="mdi-menu-up" :disabled="index == 0"
                                                @click="setSocialLinkOrder(index, index - 1)"></v-btn>
                                            <v-btn icon="mdi-menu-down" :disabled="index == (socialLinks.length - 1)"
                                                @click="setSocialLinkOrder(index, index + 1)"></v-btn>&nbsp;
                                            <v-btn icon="mdi-delete" @click="deleteSocialLink(index)"></v-btn>
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

                                            <v-alert v-if="noSocialLinks" color="error" closable border="start"
                                                icon="mdi-message-alert"
                                                :text="$t('app.radio.social_links.empty')"></v-alert>

                                            <p v-else>
                                                {{ $t('app.radio.social_links.empty') }}
                                            </p>

                                            <br />
                                            <br />
                                        </td>
                                    </tr>

                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>

                    <!-- New Social Link form -->
                    <v-row no-gutters md="12">
                        <v-col cols="12">

                            <div class="text-h5 text-center">{{ $t('app.radio.social_links.add_new_title') }}</div>
                            <v-row no-gutters>
                                <v-col cols="2">
                                    <v-select v-model="new_social_link_type.value.value"
                                        :error-messages="new_social_link_type.errorMessage.value"
                                        :items="SOCIAL_LINK_TYPES" item-title="title"
                                        @update:modelValue="setLinkTitle()" item-value="value"
                                        :label="$t('app.radio.social_links.type')" single-line></v-select>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field v-model="new_social_link_title.value.value" type="text"
                                        :error-messages="new_social_link_title.errorMessage.value" maxlength="12"
                                        name="new_social_link_title"
                                        :label="$t('app.radio.social_links.link_title')"></v-text-field>
                                </v-col>
                                <v-col cols="7">
                                    <v-text-field v-model="new_social_link_value.value.value" type="url"
                                        :error-messages="new_social_link_value.errorMessage.value" maxlength="255"
                                        name="new_social_link_value"
                                        :label="$t('app.radio.social_links.value')"></v-text-field>
                                </v-col>

                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-btn :disabled="isAppRadioBusy" block class="mt-2" @click="addSocialLink()"
                                color="secondary">{{
                                    $t('app.radio.social_links.add_new') }}</v-btn>
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

    <v-snackbar v-model="deleteRadioSuccess" color="accent">
        {{ $t('app.radios.delete_success') }}

        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="deleteRadioSuccess = false">
                {{ $t('close') }}
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="changeOrderSuccess" color="accent">
        {{ $t('app.radios.change_order_success') }}

        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="deleteRadioSuccess = false">
                {{ $t('close') }}
            </v-btn>
        </template>
    </v-snackbar>

</template>

<script setup>
import AppRadioPrerolls from './AppRadioPrerolls.vue';

import { ref, reactive } from 'vue';
import { useDisplay } from "vuetify";
import { useField, useForm } from 'vee-validate';
const props = defineProps({ platform: String, id: Number, appData: Object })
const emit = defineEmits(['AppInfoRefresh',])

const display = ref(useDisplay())

const config = useRuntimeConfig();
const { locale, t } = useI18n();

let appData = reactive(props.appData);
let radioDialog = ref(false);
let preRollDialog = ref(false);

// let appRadios = ref([]);
let scRadios = ref([]);
const appRadio = ref({});
const delDialog = ref(false);
let answerDialog = ref();
const deleteRadioSuccess = ref(false);
const deleteRadioFailed = ref(false);
const changeOrderSuccess = ref(false);
let radioStreams = ref([]);
let socialLinks = ref([]);
let noChannels = ref(false);
let noSocialLinks = ref(false);



const previewLogo = ref();
const AUDIO_FORMATS = [{ "value": "mp3", "title": 'MP3' }, { "value": "aac", "title": 'AAC' }, { "value": "flac", "title": 'FLAC' }];
const BITRATES_MP3 = [16, 24, 32, 48, 64, 96, 128, 160, 192, 256, 320];
const SERVER_TYPES = [{ "value": "icecast", "title": 'Icecast' }, { "value": "shoutcast", "title": 'Shoutcast' }, { "value": "hls", "title": 'HLS' }];

const is_ru = locale.value == 'ru';

let SOCIAL_LINK_TYPES = [
    { "value": "phone", "title": is_ru ? "Телефон" : "Phone" },
    { "value": "email", "title": 'Email' },
    { "value": "website", "title": is_ru ? "Сайт" : "Website" },
    { "value": "instagram", "title": 'Instagram' },
    { "value": "facebook", "title": 'Facebook' },
    { "value": "youtube", "title": 'YouTube' },
    { "value": "whatsapp", "title": 'WhatsApp' },
    { "value": "telegram", "title": 'Telegram' },
    { "value": "linkedin", "title": 'LinkedIn' },
    { "value": "tiktok", "title": 'TikTok' },
    { "value": "pinterest", "title": 'Pinterest' },
    { "value": "snapchat", "title": 'SnapChat' },
    { "value": "reddit", "title": 'Reddit' },
    { "value": "discord", "title": 'Discord' },
    { "value": "wechat", "title": 'WeChat' },
    { "value": "x", "title": 'X/Twitter' },
    { "value": "twitch", "title": 'Twitch' },
    { "value": "rutube", "title": 'RuTube' },
    { "value": "vk", "title": is_ru ? "Вк" : 'Vk' },
    { "value": "ok", "title": "Ok" },
    { "value": "other", "title": is_ru ? "Ещё" : 'More' },
]

const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});

const is_sc_panel = useField('is_sc_panel');
const sc_api_url = useField('sc_api_url', "url|required_if:is_sc_panel,1");
const sc_server_id = useField('sc_server_id', "required_if:is_sc_panel,1");

// required_if:is_sc_panel,1
const logo = useField('logo', "image|size:3000");

const title = useField('title', "required", { validateOnValueUpdate: false });
const description = useField('description', "required", { validateOnValueUpdate: false });
const allow_shoutbox = useField('allow_shoutbox');
const allow_history = useField('allow_history');
const allow_likes = useField('allow_likes');
const allow_dislikes = useField('allow_dislikes');

const new_channel_stream_url = useField('new_channel_stream_url', "url");
const new_channel_bitrate = useField('new_channel_bitrate',);
const new_channel_audio_format = useField('new_channel_audio_format',);
const new_channel_server_type = useField('new_channel_server_type',);

const new_social_link_type = useField('new_social_link_type');
const new_social_link_title = useField('new_social_link_title');
const new_social_link_value = useField('new_social_link_value');


new_channel_bitrate.value.value = 128;
new_channel_audio_format.value.value = AUDIO_FORMATS[0].value;
new_channel_server_type.value.value = SERVER_TYPES[0].value;

allow_shoutbox.value.value = "1";
allow_history.value.value = "1";
allow_likes.value.value = "1";
allow_dislikes.value.value = "1";

const { data: appRadios, pending, error, refresh } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/radios/`);

function setLinkTitle() {
    if (new_social_link_type.value.value) {
        new_social_link_title.value.value = SOCIAL_LINK_TYPES.filter((t) => t.value == new_social_link_type.value.value)[0].title;
    }
}
function getSocialLinkTitle(v) {
    return SOCIAL_LINK_TYPES.filter((t) => t.value == v)[0].title;
}

function getAudioFormat(v) {
    return AUDIO_FORMATS.filter((t) => t.value == v)[0].title;
}

function getServerType(v) {
    return SERVER_TYPES.filter((t) => t.value == v)[0].title;
}

function setRadioData(v) {
    const id = v || sc_server_id.value.value;
    let radio = scRadios.value.find(r => r.id === id);
    if (radio.title && !title.value.value) {
        title.value.value = radio.title;
    }
    if (radio.description && !description.value.value) {
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
    changeOrderSuccess.value = true;
    refresh();

}


function setChannelOrder(index, indexNew) {
    if (indexNew < 0 || indexNew >= radioStreams.value.length) {
        return;
    }
    [radioStreams.value[index], radioStreams.value[indexNew]] = [radioStreams.value[indexNew], radioStreams.value[index]];

}

function setSocialLinkOrder(index, indexNew) {
    if (indexNew < 0 || indexNew >= socialLinks.value.length) {
        return;
    }
    [socialLinks.value[index], socialLinks.value[indexNew]] = [socialLinks.value[indexNew], socialLinks.value[index]];

}

async function generateLogoPreview() {
    const { valid } = await logo.validate();
    previewLogo.value = valid && logo.value.value[0] ? URL.createObjectURL(logo.value.value[0]) : undefined;
}

async function checkSCPanelURL(set_data) {

    let serversURL = `${sc_api_url.value.value}/api/v2/servers/`;

    // If URL is not HTTPS - make a request to the server
    if (!sc_api_url.value.value.startsWith('https://')) {
        serversURL = `${config.public.baseURL}/mobile_apps/${props.platform}/${appRadio.value.id}/get_servers/?url=${encodeURIComponent(serversURL)}`
    }

    scRadios.value = [];
    try {
        scRadios.value = await fetchAuth(serversURL);
        for (let i = 0; i < scRadios.value.length; i++) {
            scRadios.value[i]['id_title'] = `${scRadios.value[i].title} (${scRadios.value[i].id})`
        }
    }
    catch (e) {

    }
    if (!scRadios.value || !scRadios.value.length) {
        setErrors({ 'sc_api_url': t(`app.radio.errors.invalid_sc_url`) })
        return;
    }
    if (set_data) {
        sc_server_id.value.value = scRadios.value[0].id;
        setRadioData();
    }
}


function openRadioDialog(r = null) {
    if (r) {
        appRadio.value = { ...r }
        title.value.value = r.title;
        description.value.value = r.description;
        is_sc_panel.value.value = r.sc_api_url ? "1" : null;
        if (is_sc_panel.value.value) {
            sc_api_url.value.value = r.sc_api_url;
            sc_server_id.value.value = r.sc_server_id;
            allow_shoutbox.value.value = r.allow_shoutbox ? '1' : null;
            allow_history.value.value = r.allow_history ? '1' : null;
            allow_likes.value.value = r.allow_likes ? '1' : null;
            allow_dislikes.value.value = r.allow_dislikes ? '1' : null;
            checkSCPanelURL(false);
        }
        radioStreams.value = [...r.channels];
        socialLinks.value = [...r.social_links];

    }
    else {
        resetRadioForm();
    }
    radioDialog.value = true;
}
function openPrerollDialog(r = null) {
    if (r) {
        appRadio.value = { ...r }
    }
    preRollDialog.value = true;
}

function resetRadioForm() {
    title.value.value = '';
    description.value.value = '';
    is_sc_panel.value.value = null;
    logo.value.value = '';
    sc_api_url.value.value = '';
    sc_server_id.value.value = '';
    new_channel_bitrate.value.value = 128;
    new_channel_audio_format.value.value = AUDIO_FORMATS[0].value;
    new_channel_server_type.value.value = SERVER_TYPES[0].value;

    new_social_link_type.resetField();
    new_social_link_title.resetField();
    new_social_link_value.resetField();


    radioStreams.value = [];
    socialLinks.value = [];
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
                    if (appRadios.value.length == 1) {
                        emit('AppInfoRefresh');
                    }
                    refresh();
                },
                () => {
                    deleteRadioFailed.value = true;
                }
            );
        }
    })
}

function deleteChannel(channel_index) {
    radioStreams.value.splice(channel_index, 1);
}

function deleteSocialLink(link_index) {
    socialLinks.value.splice(link_index, 1);
}

async function syncStreams() {
    try {
        var localradioStreams = [];
        const channelData = await $fetch(`${sc_api_url.value.value}/api/v2/channels/?server=${sc_server_id.value.value}`);
        for (let i = 0; i < channelData.length; i++) {
            const channel = channelData[i];
            if(channel.active){
                localradioStreams.push({
                    stream_url: channel.stream_url,
                    bitrate: channel.bitrate,
                    audio_format: channel.s_format,
                    server_type: channel.s_type.startsWith('hls') ? 'hls' : (channel.s_type.startsWith('shoutcast') ? 'shoutcast' : 'icecast'),
                });
            }
        }
        if(localradioStreams.length > 0){
            radioStreams.value = localradioStreams;
            noChannels.value = false;
        }
    }
    catch (e) {

    }
}

function addStream() {
    noChannels.value = false;
    if (!new_channel_stream_url.value.value) {
        setErrors({ ['new_channel_stream_url']: t(`errors.required`) });
        return;
    }
    if (new_channel_server_type.value.value == 'hls') {
        var parser = document.createElement('a');
        parser.href = new_channel_stream_url.value.value;
        if (parser.pathname.split('.').pop().toLowerCase() != 'm3u8') {
            setErrors({ ['new_channel_stream_url']: t(`app.errors.hls_not_m3u8`) });
            return;
        }
    }

    radioStreams.value.push({
        stream_url: new_channel_stream_url.value.value,
        // stream_url_fallback: new_channel_stream_url_fallback,
        bitrate: new_channel_bitrate.value.value,
        audio_format: new_channel_audio_format.value.value,
        server_type: new_channel_server_type.value.value,
    });

    new_channel_stream_url.value.value = '';
    new_channel_bitrate.value.value = 128;
    new_channel_audio_format.value.value = AUDIO_FORMATS[0].value;
    new_channel_server_type.value.value = SERVER_TYPES[0].value;

}

async function addSocialLink() {

    if (!new_social_link_type.value.value) {
        setErrors({ ['new_social_link_type']: t(`errors.required`) });
        return;
    }
    if (!new_social_link_title.value.value) {
        setErrors({ ['new_social_link_title']: t(`errors.required`) });
        return;
    }
    if (!new_social_link_value.value.value) {
        setErrors({ ['new_social_link_value']: t(`errors.required`) });
        return;
    }
    // Validate URL format for relevant social link types
    if (new_social_link_type.value.value !== 'phone' &&
        new_social_link_type.value.value !== 'email' && new_social_link_type.value.value !== 'whatsapp') {

        const urlPattern = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

        if (!urlPattern.test(new_social_link_value.value.value)) {
            setErrors({ ['new_social_link_value']: t('errors.url') });
            return;
        }
    }
    else if (new_social_link_type.value.value === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(new_social_link_value.value.value)) {
            setErrors({ ['new_social_link_value']: t('errors.email') });
            return;
        }
    }
    else if (new_social_link_type.value.value === 'phone') {
        const phonePattern = /^\+?[\d\s-()]+$/;
        if (!phonePattern.test(new_social_link_value.value.value)) {
            setErrors({ ['new_social_link_value']: t('errors.phone') });
            return;
        }
    }

    socialLinks.value.push({
        type: new_social_link_type.value.value,
        title: new_social_link_title.value.value,
        value: new_social_link_value.value.value,
    });
    noSocialLinks.value = false;

    new_social_link_type.resetField();
    new_social_link_title.resetField();
    new_social_link_value.resetField();

}

function isScRadio() {
    return is_sc_panel.value.value == '1';
}

async function saveAppRadioRequest(values) {
    const isEditMode = Boolean(appRadio.value.id);

    let formData = new FormData();

    formData.append('app', appData.id);
    formData.append('title', values.title);
    formData.append('description', values.description);
    values.logo && formData.append('logo', values.logo[0]);
    if (isScRadio()) {
        formData.append('sc_api_url', sc_api_url.value.value);
        formData.append('sc_server_id', sc_server_id.value.value);
        formData.append('allow_shoutbox', allow_shoutbox.value.value == '1');
        formData.append('allow_history', allow_history.value.value == '1');
        
        formData.append('allow_likes', allow_likes.value.value == '1');
        formData.append('allow_dislikes', allow_dislikes.value.value == '1');

    }
    else {
        formData.append('sc_api_url', '');
        formData.append('sc_server_id', '');
        formData.append('allow_shoutbox', false);
        formData.append('allow_history', false);
        formData.append('allow_likes', false);
        formData.append('allow_dislikes', false);
    }
    // formData.append('channels', JSON.stringify(radioStreams.value));
    var blob = new Blob([JSON.stringify(radioStreams.value)], { type: "application/json" });
    formData.append('channels', blob);

    blob = new Blob([JSON.stringify(socialLinks.value)], { type: "application/json" });
    formData.append('social_links', blob);


    return await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/radios/` + (isEditMode ? appRadio.value.id + '/' : ''), {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData
    });
}

const onAppRadioSubmit = handleSubmit(async values => {

    noChannels.value = false;

    const isEditMode = Boolean(appRadio.value.id);
    if (!isEditMode) {
        if (!logo.value.value) {
            setErrors({ ['logo']: t(`errors.required`) });
            return;
        }
    }
    let response;
    try {
        response = await saveAppRadioRequest(values);
    }
    catch (e) {
        const errorData = e.data;
        if (typeof errorData == 'object') {
            for (const [field, errors] of Object.entries(errorData)) {
                if (field == 'channels' && errors.indexOf('required') >= 0) {
                    noChannels.value = true;
                }
                for (const errCode of errors) {
                    setErrors({ [field]: t(`app.errors.${field}.${errCode}`) })
                }
            }
        }
        return;
    }
    if (appRadios.value.length == 0) {
        emit('AppInfoRefresh');
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
