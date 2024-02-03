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
                            <th class="text-left">
                                {{ $t('app.radio.title') }}
                            </th>
                            <th>
                                &nbsp;
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-if="appRadios.length > 0" v-for="item in android_apps" :key="item.id">
                            <td>
                                <NuxtLink :to="'/apps/android/' + item.id + '/'">{{ item.title }}</NuxtLink>
                            </td>
                            <td>
                                <NuxtLink :to="'/apps/android/' + item.id + '/'"><v-btn icon="mdi-pencil"></v-btn>
                                </NuxtLink>
                            </td>
                        </tr>

                        <tr v-else-if="radios_loading">
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

    <v-dialog v-model="radioDialog" width="auto">
        <v-card>
            <v-card-text>
                <v-form @submit.prevent="onAppRadioSubmit" :disabled="isAppRadioBusy">

                    <v-checkbox v-model="is_sc_panel.value.value" value="1" :label="$t('app.radio.is_sc_panel')"
                        type="checkbox"></v-checkbox>

                    <v-text-field v-if="is_sc_panel.value.value == '1'" v-model="sc_api_url.value.value" type="url"
                        @change="checkSCPanelURL()" :error-messages="sc_api_url.errorMessage.value" name="sc_api_url"
                        :label="$t('app.radio.sc_api_url')" :hint="$t('app.radio.sc_api_url_hint')"
                        persistent-hint></v-text-field>

                    <v-select v-if="is_sc_panel.value.value == '1' && scRadios.length > 0" @update:modelValue="setRadioData"
                        v-model="sc_server_id.value.value" :hint="$t('app.radio.sc_server_id_hint')" :items="scRadios" item-title="id" item-value="id"
                        :label="$t('app.radio.sc_server_id_hint')" persistent-hint single-line></v-select>


                    <v-text-field v-model="title.value.value" type="text" :error-messages="title.errorMessage.value"
                        :label="$t('app.radio.title')" maxlength="150"></v-text-field>
                    <v-textarea v-model="description.value.value" :label="$t('app.radio.description')"
                        :error-messages="description.errorMessage.value" :hint="$t('app.radio.description_hint')"
                        persistent-hint></v-textarea>

                    <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_shoutbox.value.value" value="1"
                        :label="$t('app.radio.allow_shoutbox')" type="checkbox"></v-checkbox>

                    <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_likes.value.value" value="1"
                        :label="$t('app.radio.allow_likes')" type="checkbox"></v-checkbox>

                    <v-checkbox v-if="is_sc_panel.value.value == '1'" v-model="allow_dislikes.value.value" value="1"
                        :label="$t('app.radio.allow_dislikes')" type="checkbox"></v-checkbox>

                    <v-btn type="submit" :disabled="isAppRadioBusy" block class="mt-2" color="primary">{{
                        isAppRadioBusy ? $t('loading') : $t('save') }}</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
        <v-btn color="primary" block @click="radioDialog = false">{{ $t('close') }}</v-btn>
    </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';
const props = defineProps({ platform: String, id: Number, appData: Object })

const config = useRuntimeConfig();
const { locale, t } = useI18n();

let appData = reactive(props.appData);
let radioDialog = ref(false);
let appRadios = ref([]);
let scRadios = ref([]);

const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});


const is_sc_panel = useField('is_sc_panel');
const sc_api_url = useField('sc_api_url', "required|url");
const sc_server_id = useField('sc_server_id', "required");

const title = useField('title', "required");
const description = useField('description', "required");
const allow_shoutbox = useField('allow_shoutbox');
const allow_likes = useField('allow_likes');
const allow_dislikes = useField('allow_dislikes');

function setRadioData(v){
    const id = v || sc_server_id.value.value;
    let radio = scRadios.value.find(r => r.id === id);
    if(radio.title){
        title.value.value = radio.title;
    }
    if(radio.description){
        description.value.value = radio.description;
    }
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
const onAppRadioSubmit = handleSubmit(async values => {

    let response;
    try {
        response = await appUpdateRequest(values);
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
    emit('AppInfoRefresh');
    icon.value.value = '';
    logo.value.value = '';
    // router.push(`/apps/${platform}/${response.data.value.id}`);
});


</script>
