<template>
    <v-dialog v-model="props.modelValue" width="auto">
        <v-form @submit.prevent="sendPushNotification()" :disabled="pushNotificationInProgress">
            <v-card :title="$t('apps.send_push')">
                <v-card-text>
                    <v-text-field v-model="push_title.value.value" type="text"
                        :error-messages="push_title.errorMessage.value" :label="$t('apps.push_title')"
                        maxlength="65"></v-text-field>
                    <v-textarea v-model="push_text.value.value" :label="$t('apps.push_text')"
                        :error-messages="push_text.errorMessage.value"></v-textarea>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="grey" @click="emit('update:modelValue', false)">{{ $t('cancel')
                        }}</v-btn>
                    <v-btn type="submit" variant="outlined" color="primary">{{ $t('apps.send_push_cta') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>

    </v-dialog>

</template>

<script setup>
import { useField, useForm } from 'vee-validate';

const props = defineProps({ platform: String, id: Number, modelValue: Boolean })

const config = useRuntimeConfig();
const emit = defineEmits(['update:modelValue', 'pushResult'])


const { handleSubmit, isSubmitting: pushNotificationInProgress } = useForm({
    initialValues: {
        push_title: '',
        push_text: '',
    }
});

const push_title = useField('push_title', "required|max:65");
const push_text = useField('push_text', "required|max:200");

const sendPushNotification = handleSubmit(async values => {
    let response;
    try {
        response = await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/send_push/`, {
            method: 'POST',
            body: {
                title: values.push_title,
                text: values.push_text,
            }
        });
        emit('update:modelValue', false)
        emit('pushResult', true)
    }
    catch (e) {
        emit('pushResult', false)
    }

});


</script>
