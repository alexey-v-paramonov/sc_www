<template>
    123
    <v-container>
        <v-row no-gutters md="12">

            <v-col cols="6">
                <v-form @submit.prevent="onAppDesignSubmit" :disabled="isSettingsSubmitting">
                    <v-text-field v-model="title.value.value" type="color" :error-messages="title.errorMessage.value"
                        :label="$t('app.title')" maxlength="30"></v-text-field>

                </v-form>
            </v-col>

            <!-- Preview -->
            <v-col cols="6">
            </v-col>

        </v-row>
    </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';

const { handleSubmit, isSubmitting: isAppInfoSubmitting, setErrors } = useForm({
    initialValues: {
        // title: appData.value.title || '',
        // email: appData.value.email || stateUser.user.email,
        // description: appData.value.description || '',
        // description_short: appData.value.description_short || '',
        // website_url: appData.value.website_url || '',
    }
});


const tabs_color = useField('tabs_color');
const tabs_icon_color = useField('tabs_icon_color');
const tabs_icon_selected_color = useField('tabs_icon_selected_color');
const main_theme_color = useField('main_theme_color');
const text_secondary_color = useField('text_secondary_color');
const play_button_border_color = useField('play_button_border_color');
const volume_buttons_color = useField('volume_buttons_color');
const volume_bar_active_color = useField('volume_bar_active_color');
const volume_bar_inactive_color = useField('volume_bar_inactive_color');
const bg_color = useField('bg_color');
const bg_color_gradient = useField('bg_color_gradient');
const font_color = useField('font_color');

</script>
