<template>
    <v-container>
        <v-row no-gutters md="12">
            <v-col>
                <div class="text-h5">{{ $t('self_hosted.radio.title') }}</div>
            </v-col>
        </v-row>
        <v-form @submit.prevent="onSelfHostedSubmit" :disabled="isSelfHostedSubmitting">
        <v-row>
            <v-col md="12">
                <v-text-field v-model="ip.value.value" type="text" :error-messages="ip.errorMessage.value"
                    :hint="$t('self_hosted.ip_hint')" persistent-hint :label="$t('self_hosted.ip')"></v-text-field>
            </v-col>
        </v-row>

        <v-row no-gutters>
            <v-col md="12">
                <v-text-field v-model="domain.value.value" type="text" :error-messages="domain.errorMessage.value"
                    :label="$t('self_hosted.server_domain')" :hint="$t('self_hosted.server_domain_hint')"
                    persistent-hint></v-text-field>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col md="12">
                <v-text-field v-model="ssh_username.value.value" type="text"
                    :error-messages="ssh_username.errorMessage.value" :label="$t('self_hosted.root_username')"
                    :hint="$t('self_hosted.root_username_hint')" persistent-hint></v-text-field>
            </v-col>
        </v-row>

        <v-row no-gutters>
            <v-col md="12">
                <v-text-field v-model="ssh_password.value.value" type="text"
                    :error-messages="ssh_password.errorMessage.value" :label="$t('self_hosted.root_password')"
                    :hint="$t('self_hosted.root_password_hint')" persistent-hint></v-text-field>
            </v-col>
        </v-row>

        <v-row no-gutters>
            <v-col md="12">
                <v-text-field v-model="ssh_port.value.value" type="text" :error-messages="ssh_port.errorMessage.value"
                    :label="$t('self_hosted.server_port')"></v-text-field>
            </v-col>
        </v-row>
        <v-btn type="submit" :disabled="isSelfHostedSubmitting" block class="mt-2" color="primary">{{
                        isSelfHostedSubmitting ? $t('loading') : $t('save') }}</v-btn>

    </v-form>

    </v-container>
</template>

<script setup>

definePageMeta({
  layout: "default",
  middleware: 'auth',
});
import { ref, reactive } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useUiStateStore } from '@/stores/ui'
import { useUserStore } from '~/stores/user'

const stateUI = useUiStateStore()
const stateUser = useUserStore()
const router = useRouter();
const route = useRoute()
const config = useRuntimeConfig();

const { data: radioData, pending, error, refresh } = await useFetchAuth(`${config.public.baseURL}/self_hosted_radio/${route.params.id}/`);

const { handleSubmit, isSubmitting: isSelfHostedSubmitting, setErrors, errorBag } = useForm({
    initialValues: {
        ip: radioData.value.ip,
        domain: radioData.value.domain,
        ssh_username: radioData.value.ssh_username,
        ssh_password: radioData.value.ssh_password,
        ssh_password: radioData.value.ssh_password,
    }
});

const ip = useField('ip', 'required');
const domain = useField('domain');
const ssh_username = useField('ssh_username');
const ssh_password = useField('ssh_password');
const ssh_port = useField('ssh_port');


async function saveSelfHostedRequest(values) {
    console.log("VALUES: ", values)
  return await fetchAuth(`${config.public.baseURL}/self_hosted_radio/${route.params.id}/`, {
      method: 'PATCH',
      body: values
  });

}

const onSelfHostedSubmit = handleSubmit(async values => {
  values.user = stateUser.user.id;

  try{
    const response = await saveSelfHostedRequest(values);
    console.log(response);
  }
  catch(e){
    const errorData = e.data;
    for (const [field, errors] of Object.entries(errorData)) {
      for(const errCode of errors){
        setErrors({ [field]: t(`radio_wizard.errors.${field}.${errCode}`) })
      }      
    }
    
    return;
  }
   router.push("/radio");
});

</script>