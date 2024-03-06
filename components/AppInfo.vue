<template>
    <v-container>
        <v-row no-gutters md="12">
            <v-col md="12">

                <v-form @submit.prevent="onAppSubmit" :disabled="isAppInfoSubmitting">
                    <v-text-field v-model="title.value.value" type="text" :error-messages="title.errorMessage.value"
                        :label="$t('app.title')" maxlength="30"></v-text-field>

                    <v-text-field v-if="isAndroid()" v-model="description_short.value.value" type="text"
                        :error-messages="description_short.errorMessage.value" :label="$t('app.description_short')"
                        :hint="$t('app.description_short_hint')" persistent-hint maxlength="80"></v-text-field>

                    <v-textarea v-model="description.value.value" :label="$t('app.description')"
                        :error-messages="description.errorMessage.value" :hint="$t('app.description_hint')"
                        persistent-hint></v-textarea>

                    <v-text-field v-model="website_url.value.value" type="url"
                        :error-messages="website_url.errorMessage.value" name="website_url"
                        :label="$t('app.website_url_label')"></v-text-field>

                    <v-text-field v-model="email.value.value" type="email" :error-messages="email.errorMessage.value"
                        :label="$t('email')"></v-text-field>

                    <v-text-field v-if="locale == 'ru'" v-model="yandex_appmetrica_key.value.value" type="text"
                        :error-messages="yandex_appmetrica_key.errorMessage.value" label="API ключ Яндекс AppMetrica"
                        >
                        <template #details >
                            <div class="text-left">
                                Вы можете зарегистрировать своё приложение на <a href="https://appmetrica.yandex.ru/" target="_blank">Яндекс AppMetrica</a>, получить ключ, внести его в это поле и собирать дополнительную статистику по приложению.
                            </div>
                            
                        </template>
                    </v-text-field>

                    <v-file-input prepend-icon="mdi-account-box-outline" show-size :label="$t('app.icon')"
                        @change="generateIconPreview()" @click:clear="generateIconPreview()" name="icon"
                        v-model="icon.value.value" :error-messages="icon.errorMessage.value" accept="image/png"
                        :hint="$t('app.icon_hint') + icon_resolution + $t('app.icon_pixels')" persistent-hint>
                    </v-file-input>

                    <v-row>
                        <v-col cols="6" class="text-center">
                            <img v-if="appData.icon || previewIcon" :src="previewIcon ? previewIcon : appData.icon"
                                class="app-image-preview" />
                            <v-icon v-else icon="mdi-tooltip-image-outline" size="x-large"
                                style="font-size: 300px;"></v-icon>
                        </v-col>
                        <v-col cols="6" class="text-center">
                            <img src="/img/app_icon.png" :alt="$t('app.icon')" />
                        </v-col>
                    </v-row>



                    <v-file-input prepend-icon="mdi-image" show-size :label="$t('app.logo')"
                        @change="generateLogoPreview()" @click:clear="generateLogoPreview()" name="logo"
                        v-model="logo.value.value" :error-messages="logo.errorMessage.value" accept="image/png"
                        :hint="$t('app.logo_hint')" persistent-hint></v-file-input>

                    <v-row>
                        <v-col cols="6" class="text-center">
                            <img v-if="appData.logo || previewLogo" :src="previewLogo ? previewLogo : appData.logo"
                                class="app-image-preview" />
                            <v-icon v-else icon="mdi-tooltip-image-outline" size="x-large"
                                style="font-size: 300px;"></v-icon>
                        </v-col>
                        <v-col cols="6" class="text-center">
                            <img src="/img/app_logo.png" :alt="$t('app.logo')" />
                        </v-col>
                    </v-row>


                    <v-btn type="submit" :disabled="isAppInfoSubmitting" block class="mt-2" color="primary">{{
                    isAppInfoSubmitting ? $t('loading') : $t('save') }}</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';
const emit = defineEmits(['AppInfoRefresh',])
const { locale } = useI18n();


const config = useRuntimeConfig();
const stateUser = useUserStore();
const props = defineProps({ platform: String, id: Number, appData: Object })
const icon_resolution = ref(props.platform == 'android' ? '512x512' : '1536x1536');
let appData = reactive(props.appData);

// Form
const { handleSubmit, isSubmitting: isAppInfoSubmitting, setErrors } = useForm({
    initialValues: {
        title: appData.title || '',
        email: appData.email || stateUser.user.email,
        description: appData.description || '',
        description_short: appData.description_short || '',
        website_url: appData.website_url || '',
        yandex_appmetrica_key: appData.yandex_appmetrica_key || ''
    }
});

const title = useField('title', "required|max:30");
const description_short = useField('description_short', "required|max:80");
const description = useField('description', "required");
const website_url = useField('website_url', "url");
const email = useField('email', "required|email");
const yandex_appmetrica_key = useField('yandex_appmetrica_key', "");

const icon = useField('icon', "image|size:2000|dimensions:" + (props.platform == 'android' ? '512,512' : '1536,1536'));
const logo = useField('logo', "image|size:2000");
const previewIcon = ref();
const previewLogo = ref();


async function generateIconPreview() {
    const { valid } = await icon.validate();
    previewIcon.value = valid && icon.value.value[0] ? URL.createObjectURL(icon.value.value[0]) : undefined;
}

async function generateLogoPreview() {
    const { valid } = await logo.validate();

    previewLogo.value = valid && logo.value.value[0] ? URL.createObjectURL(logo.value.value[0]) : undefined;
}


function isAndroid() {
    return props.platform == 'android';
}

async function appUpdateRequest(values) {
    const platform = isAndroid() ? "android" : "ios";
    let formData = new FormData();
    formData.append('title', values.title);
    formData.append('user', stateUser.user.id);
    formData.append('description', values.description);
    formData.append('description_short', values.description_short);
    values.website_url && formData.append('website_url', values.website_url);
    formData.append('email', values.email);
    values.icon && formData.append('icon', values.icon[0]);
    values.logo && formData.append('logo', values.logo[0]);
    values.yandex_appmetrica_key && formData.append('yandex_appmetrica_key', values.yandex_appmetrica_key);

    return await fetchAuth(`${config.public.baseURL}/mobile_apps/${platform}/${props.id}/`, {
        method: 'PATCH',
        body: formData
    });

}


const onAppSubmit = handleSubmit(async values => {
    console.log("onAppSubmit!")

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

<style scoped>
.app-image-preview {
    max-height: 300px;
    max-width: 300px;
}
</style>
