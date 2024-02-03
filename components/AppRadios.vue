<template>
    <v-container>
        <v-row>
            <v-col md="12">
                <div class="text-h5">{{ $t('app.radios.title') }}</div>
                <div class="text-caption">{{ $t('app.radios.description') }}</div>

            </v-col>
        </v-row>

        <v-btn block color="primary" prepend-icon="mdi-plus" @click="radioDialog = true">{{ $t('app.radios.add') }}</v-btn>

    </v-container>

    <v-dialog v-model="radioDialog" width="auto">
        <v-card>
            <v-card-text>
                <v-form @submit.prevent="onAppRadioSubmit" :disabled="isAppRadioBusy">

                    <v-text-field v-model="title.value.value" type="text" :error-messages="title.errorMessage.value"
                        :label="$t('app.title')" maxlength="30"></v-text-field>
                    <v-textarea v-model="description.value.value" :label="$t('app.description')"
                        :error-messages="description.errorMessage.value" :hint="$t('app.description_hint')"
                        persistent-hint></v-textarea>

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

let appData = reactive(props.appData);
let radioDialog = ref(false)

const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});

const title = useField('title', "required");
const description = useField('description', "required");


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
