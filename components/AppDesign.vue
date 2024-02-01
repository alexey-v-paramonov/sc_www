<template>
    <v-container>
        <v-row no-gutters md="12">
            <v-col cols="6">
                <v-form @submit.prevent="onAppDesignSubmit" :disabled="isAppDesignSubmitting">

                    {{ $t('app.design.bg_color') }}
                    <v-color-picker v-model="bg_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.bg_color_gradient') }}
                    <v-color-picker v-model="bg_color_gradient.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.font_color') }}
                    <v-color-picker v-model="font_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.text_secondary_color') }}
                    <v-color-picker v-model="text_secondary_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.button_text_color') }}
                    <v-color-picker v-model="button_text_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.tabs_color') }}
                    <v-color-picker v-model="tabs_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.tabs_icon_color') }}
                    <v-color-picker v-model="tabs_icon_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.tabs_icon_selected_color') }}
                    <v-color-picker v-model="tabs_icon_selected_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.main_theme_color') }}
                    <v-color-picker v-model="main_theme_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.play_button_border_color') }}
                    <v-color-picker v-model="play_button_border_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.volume_buttons_color') }}
                    <v-color-picker v-model="volume_buttons_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.volume_bar_active_color') }}
                    <v-color-picker v-model="volume_bar_active_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                    {{ $t('app.design.volume_bar_inactive_color') }}
                    <v-color-picker v-model="volume_bar_inactive_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>

                </v-form>
            </v-col>

            <!-- Preview -->
            <v-col cols="6">
                <div class="sticky-top">
                Preview

                <v-btn color="primary">{{ $t('app.design.choose_skin') }}</v-btn>

                </div>
            </v-col>

        </v-row>
        <v-row no-gutters md="12">
            <v-col>
                <v-btn type="submit" :disabled="isAppDesignSubmitting" block class="mt-2" color="primary">{{
                    isAppDesignSubmitting ? $t('loading') : $t('save') }}</v-btn>
            </v-col>

        </v-row>


    </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';
// const emit = defineEmits(['AppInfoRefresh',])
const props = defineProps({ platform: String, id: Number, appData: Object })


const { handleSubmit, isSubmitting: isAppDesignSubmitting } = useForm({
    initialValues: props.appData
});

const bg_color = useField('bg_color');
const bg_color_gradient = useField('bg_color_gradient');
const font_color = useField('font_color');
const text_secondary_color = useField('text_secondary_color');

const button_text_color = useField('button_text_color');
const tabs_color = useField('tabs_color');
const tabs_icon_color = useField('tabs_icon_color');
const tabs_icon_selected_color = useField('tabs_icon_selected_color');
const main_theme_color = useField('main_theme_color');
const play_button_border_color = useField('play_button_border_color');
const volume_buttons_color = useField('volume_buttons_color');
const volume_bar_active_color = useField('volume_bar_active_color');
const volume_bar_inactive_color = useField('volume_bar_inactive_color');


</script>

<style scoped>
.sticky-top {
    position: sticky;
    top: 10px;
}</style>
