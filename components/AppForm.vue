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
                                :error-messages="description.errorMessage.value"
                                :hint="$t('app.description_hint')" persistent-hint></v-textarea>

                            <v-text-field v-model="website_url.value.value" type="url"
                                :error-messages="website_url.errorMessage.value" name="website_url"
                                :label="$t('app.website_url_label')"></v-text-field>

                            <v-text-field v-model="email.value.value" type="email"
                                :error-messages="email.errorMessage.value" :label="$t('email')"></v-text-field>

                            <v-file-input prepend-icon="mdi-account-box-outline" show-size :label="$t('app.icon')"
                                @change="generateIconPreview()"
                                @click:clear="generateIconPreview()"
                                name="icon"
                                v-model="icon.value.value"
                                :error-messages="icon.errorMessage.value"
                                accept="image/png"
                                :hint="$t('app.icon_hint') + icon_resolution + $t('app.icon_pixels')" persistent-hint>
                            </v-file-input>

                            <img v-if="previewIcon" :src="previewIcon" class="app-image-preview" />
                            <img src="/img/app_icon.png" :alt="$t('app.icon')" />


                            <v-file-input prepend-icon="mdi-image" show-size :label="$t('app.logo')"
                                @change="generateLogoPreview()"
                                @click:clear="generateLogoPreview()"
                                name="logo"
                                v-model="logo.value.value"
                                :error-messages="logo.errorMessage.value"
                                accept="image/png"
                                :hint="$t('app.logo_hint')" persistent-hint></v-file-input>

                            <img v-if="previewLogo" :src="previewLogo" class="app-image-preview" />

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
const stateUser = useUserStore();
const props = defineProps({ platform: String, id: Number })
// const router = useRouter();

let appData = reactive({});
let appRequesFailed = ref(false);
let tab = ref("app_info");
const icon_resolution = ref(props.platform == 'android'? '512x512' : '1536x1536');

// Load app data
const { data, pending, error } = await useFetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/`);
appData.value = data.value || {};

if (error.value) {
    appRequesFailed.value = true;
    // router.push(`/apps/${props.platform}/`);
}



// Form
const { handleSubmit, isSubmitting: isSettingsSubmitting, setErrors } = useForm({
    initialValues: {
        title: appData.value.title || '',
        email: appData.value.email || stateUser.user.email,
        description: appData.value.description || '',
        description_short: appData.value.description_short || '',
        website_url: appData.value.website_url || '',
    }
});

const title = useField('title', "required|max:30");
const description_short = useField('description_short', "required|max:80");
const description = useField('description', "required");
const website_url = useField('website_url', "url");
const email = useField('email', "required|email");
const icon = useField('icon', "image|size:2000|dimensions:" + (props.platform == 'android'? '512,512' : '1536,1536'));
const logo = useField('logo', "image|size:2000");
const previewIcon = ref();
const previewLogo = ref();


async function generateIconPreview(){
    const { valid } = await icon.validate();
    previewIcon.value = valid && icon.value.value[0] ? URL.createObjectURL(icon.value.value[0]) : undefined;
}

async function generateLogoPreview(){
    const { valid } = await icon.validate();

    previewLogo.value = valid && logo.value.value[0] ? URL.createObjectURL(logo.value.value[0]) : undefined;
}


function isAndroid() {
    return props.platform == 'android';
}

function isIos() {
    return props.platform == 'ios';
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

  return await useFetchAuth(`${config.public.baseURL}/mobile_apps/${platform}/${props.id}/`, {
    method: 'PATCH',
    body: formData
  });

}


const onAppSubmit = handleSubmit(async values => {
  console.log("VALUES: ", values);

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
  // router.push(`/apps/${platform}/${response.data.value.id}`);
});


</script>

<style scoped>
.app-image-preview{
    max-height: 300px; 
    max-width: 300px;
}
</style>