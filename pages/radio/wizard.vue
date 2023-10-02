<template>
  <v-container>
    <v-row>
      <v-col md="12">
        <div class="text-h5">{{ $t('service_type') }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form @submit.prevent="submit">

          <v-radio-group v-model="hosting_type">
            <v-radio value="1">
              <template #label>
                <div>
                  {{ $t('self_hosted.title') }}

                  <div class="text-caption">{{ $t('self_hosted.help') }}</div>
                </div>
              </template>
            </v-radio>
            <br />
            <v-radio value="2">
              <template #label>
                <div>
                  {{ $t('hosted.title') }}
                  <div class="text-caption">{{ $t('hosted.help') }}</div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <!-- Self hosted form -->
          <template v-if="isSelfHosted()">
            <v-row>
              <v-col md="12">
                {{ $t('self_hosted.description') }}
                <br />
                {{ $t('self_hosted.supported_os') }}
              </v-col>
            </v-row>

            <v-row>
              <v-col md="1"><strong>{{ $t('service_price') }}</strong></v-col>
              <v-col md="11">
                <template v-if="locale == 'en'">
                  <b>10$ per month</b> if you have up to 5 radio stations.<br /> Each additional station costs $1, so if
                  your server is running 10 stations the price is: 10$ + 5*1$ = 15$ per month.
                </template>

                <template v-else>
                  <b>400 рублей</b> в месяц, включено до 5 станций.<br /> Каждая дополнительная станция - дополнительно 80
                  рублей. Если, например, всего станций 8 - то стоимость составит 400 + 3 * 80 = 640 рублей в месяц.
                </template>

              </v-col>
            </v-row>

            <v-row>
              <v-col md="12">
                <v-text-field v-model="server_ip.value.value" type="text" :error-messages="server_ip.errorMessage.value"
                  :hint="$t('self_hosted.ip_hint')" persistent-hint :label="$t('self_hosted.ip')"></v-text-field>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col md="12">
                <v-checkbox v-model="install_myself.value.value" :error-messages="install_myself.errorMessage.value"
                  value="1" :label="$t('self_hosted.include_installation')" type="checkbox"
                  :hint="$t('self_hosted.include_installation_hint')" persistent-hint></v-checkbox>
              </v-col>
            </v-row>

            <v-row no-gutters v-if="install_myself.value.value == '1'">
              <v-col md="12">
                <v-text-field v-model="server_domain.value.value" type="text"
                  :error-messages="server_domain.errorMessage.value" :label="$t('self_hosted.server_domain')"
                  :hint="$t('self_hosted.server_domain_hint')" persistent-hint></v-text-field>
              </v-col>
            </v-row>

            <v-row no-gutters v-if="install_myself.value.value == '1'">
              <v-col md="12">
                <v-text-field v-model="server_root_password.value.value" type="text"
                  :error-messages="server_root_password.errorMessage.value" :label="$t('self_hosted.root_password')"
                  :hint="$t('self_hosted.root_password_hint')" persistent-hint></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="install_myself.value.value != '1'">
              <v-col md="12">
                {{ $t('self_hosted.install_command') }}:<br />
                <b>bash &lt;(wget -qO- https://streaming.center/dist/install.sh)</b>
              </v-col>
            </v-row>

          </template>

          <v-row v-if="isHosted()">
            <v-col md="12">
              <div class="text-h5">{{ $t('hosted.legal') }}</div>


              <v-radio-group v-model="legal_type.value.value">
                <v-radio value="1">
                  <template #label>
                    <div>
                      {{ $t('hosted.legal_1') }}

                      <div class="text-caption">{{ $t('hosted.legal_1_help') }}</div>
                    </div>
                  </template>
                </v-radio>
                <br />
                <v-radio value="2">
                  <template #label>
                    <div>
                      {{ $t('hosted.legal_2') }}
                      <div class="text-caption">{{ $t('hosted.legal_2_help') }}</div>
                    </div>
                  </template>
                </v-radio>
                <br />
                <v-radio value="3">
                  <template #label>
                    <div>
                      {{ $t('hosted.legal_3') }}
                      <div class="text-caption">{{ $t('hosted.legal_3_help') }}</div>
                    </div>
                  </template>
                </v-radio>

              </v-radio-group>

              <v-text-field v-model="station_id.value.value" type="text" :error-messages="station_id.errorMessage.value"
                :label="$t('hosted.station_id')"></v-text-field>

            </v-col>
          </v-row>


          <v-row>
            <v-col md="12">
              <v-textarea :label="$t('self_hosted.comments')"></v-textarea>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col md="12">

              <v-btn type="submit" block class="mt-2">{{ $t('self_hosted.submit') }}</v-btn>
            </v-col>
          </v-row>

        </form>


      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>

definePageMeta({
  layout: "default",
  middleware: 'auth',
});

import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';


export default {
  setup() {
    const { locale, t } = useI18n();
    console.log(locale.value, " ???")
    const hosting_type = ref('1');
    // Self-hosted params
    //const server_ip = ref('');
    const server_ip = useField('server_ip', "required");

    const install_myself = useField('install_myself');
    const server_root_password = useField('server_root_password', "required");
    const server_domain = useField('server_domain');

    // Hosted params 
    const legal_type = useField('legal_type', "required");
    const station_id = useField('station_id', "required");


    install_myself.value.value = "1";
    legal_type.value.value = "1";
    const domain_name = ref('');
    const ssh_root_pass = ref('');
    const additional_notes = ref('');
    // Hosted params
    const username = ref('');

    function isSelfHosted() {
      return hosting_type.value == '1';
    }

    function isHosted() {
      return hosting_type.value == '2';
    }


    return {
      hosting_type,
      server_ip,
      install_myself,
      server_domain,
      server_root_password,
      domain_name,
      ssh_root_pass,
      additional_notes,
      legal_type,
      station_id,
      isSelfHosted,
      isHosted,
      locale
    }
  }
}

</script>
