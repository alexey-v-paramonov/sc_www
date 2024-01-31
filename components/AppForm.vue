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
                <v-row no-gutters md="12" v-if="pending">
                    <v-col>
                        <v-progress-circular indeterminate></v-progress-circular>
                    </v-col>
                </v-row>

                <v-row no-gutters md="12">
                    <v-col md="12">
                        <v-form @submit.prevent="onAppSubmit" :disabled="isSettingsSubmitting">
                            <v-text-field v-model="title.value.value" type="text" :error-messages="title.errorMessage.value"
                                :label="$t('app.title')" maxlength="30"></v-text-field>

                            <v-text-field v-if="isAndroid()" v-model="description_short.value.value" type="text"
                                :error-messages="description_short.errorMessage.value" :label="$t('app.description_short')"
                                :hint="$t('app.description_short_hint')" persistent-hint maxlength="80"></v-text-field>

                            <v-textarea v-model="description.value.value" :label="$t('app.description')"
                                :hint="$t('app.description_hint')" persistent-hint></v-textarea>

                            <v-text-field v-model="website_url.value.value" type="url"
                                :error-messages="website_url.errorMessage.value" name="website_url"
                                :label="$t('app.website_url_label')"></v-text-field>

                            <v-text-field v-model="email.value.value" type="email"
                                :error-messages="email.errorMessage.value" :label="$t('email')"></v-text-field>

                            <v-file-input prepend-icon="mdi-account-box-outline" show-size :label="$t('app.icon')"
                                accept="image/png"
                                :hint="$t('app.icon_hint') + icon_resolution + $t('app.icon_pixels')" persistent-hint>
                            </v-file-input>

                            <img src="/img/app_icon.png" :alt="$t('app.icon')" />


                            <v-file-input prepend-icon="mdi-image" show-size :label="$t('app.logo')"
                                accept="image/png"
                                :hint="$t('app.icon_hint') + logo_resolution + $t('app.icon_pixels')" persistent-hint></v-file-input>

                            <img src="/img/app_logo.png" :alt="$t('app.logo')" />

                            <v-btn type="submit" :disabled="isSettingsSubmitting" block class="mt-2" color="primary">{{
                                isSettingsSubmitting ? $t('loading') : $t('save') }}</v-btn>
                        </v-form>
                    </v-col>
                </v-row>
            </v-window-item>

            <!-- APP DESIGN -->
            <v-window-item value="app_design">
                2
            </v-window-item>

            <!-- APP RADIOS -->
            <v-window-item value="app_radios">
                3
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
import { useField, useForm } from 'vee-validate';


const config = useRuntimeConfig();
const props = defineProps({ platform: String, id: Number })
// const router = useRouter();

let appData = reactive({});
let appRequesFailed = ref(false);
let tab = ref("app_info");
const icon_resolution = ref(props.platform == 'android'? '512x512' : '1536x1536');

const { data, pending, error } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/`);
appData.value = data.value || {};



// Form
const { handleSubmit, isSubmitting: isSettingsSubmitting, setErrors } = useForm({
    initialValues: {
        title: appData.value.title,
    }
});

const title = useField('title', "required|max:30");
const description_short = useField('description_short', "required|max:80");
const description = useField('description', "required");
const website_url = useField('website_url', "url");
const email = useField('email', "required|email");





if (error.value) {
    appRequesFailed.value = true;
    // router.push(`/apps/${props.platform}/`);
}

function isAndroid() {
    return props.platform == 'android';
}

function isIos() {
    return props.platform == 'ios';
}


</script>