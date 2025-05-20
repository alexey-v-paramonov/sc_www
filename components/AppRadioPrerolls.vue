    <template>

        <v-card>
            <v-toolbar color="primary" dark>
                <v-btn icon @click="preRollDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('app.radio.preroll.title') }} {{ appData.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn variant="text" @click="preRollDialog = false">
                        {{ $t('close') }}
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <div class="mb-2">{{ $t('app.radio.preroll.description') }}</div>

                <div class="text-h6 mb-2">{{ $t('app.radio.preroll.list_title') }}</div>
                <v-table>
                    <thead>
                        <tr>
                            <th>{{ $t('app.radio.preroll.filename') }}</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="preRolls && preRolls.length > 0" v-for="(preroll, idx) in preRolls" :key="preroll.id">
                            <td>
                                <a :href="preroll.url" target="_blank">{{ preroll.filename }}</a>
                            </td>
                            <td>
                                <v-btn icon="mdi-delete" color="error" @click="deletePreRoll(preroll, idx)"></v-btn>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="3" class="text-center">
                                {{ $t('app.radio.preroll.empty') }}
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <div class="text-h6 mt-6 mb-2">{{ $t('app.radio.preroll.upload_title') }}</div>
                <v-form @submit.prevent="onPrerollSubmit" :disabled="isAppRadioBusy">
                    <v-file-input v-model="prerollFile.value.value" :label="$t('app.radio.preroll.select_file')"
                        accept="audio/mpeg" :disabled="isAppRadioBusy" show-size prepend-icon="mdi-music"
                        required></v-file-input>
                    <v-btn type="submit" color="primary" :loading="isAppRadioBusy"
                        :disabled="!prerollFile.value.value || isAppRadioBusy" class="mt-2" block>
                        {{ isAppRadioBusy ? $t('loading') : $t('app.radio.preroll.upload_btn') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </template>
<script setup>
import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';
const props = defineProps({ platform: String, id: Number, appData: Object })
const config = useRuntimeConfig();


let preRolls = ref([]);

const { handleSubmit, isSubmitting: isAppRadioBusy, setErrors } = useForm({
    initialValues: {
    }
});

const prerollFile = useField('preroll', "size:3000|mimes:audio/mpeg");


async function savePrerollRequest(values) {
    return await fetchAuth(`${config.public.baseURL}/mobile_apps/${props.platform}/${props.id}/prerolls/`, {
        method: 'POST',
        body: values
    });
}

const onPrerollSubmit = handleSubmit(async values => {
    console.log('onPrerollSubmit', values);
    let response;
    try {
        console.log("wtf1")
        response = await savePrerollRequest(values);
        console.log("wtf2")
    }
    catch (e) {
        console.log("wtf3", e)
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
    console.log("wtf4")

    // refresh();
    // resetRadioForm();
    // radioDialog.value = false;
});

</script>