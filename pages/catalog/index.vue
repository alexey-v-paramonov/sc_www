<template>
  <v-container>
    <v-row no-gutters md="12">
      <v-col class="text-right">
        <v-btn prepend-icon="mdi-plus" to="/catalog/0" color="primary">{{ $t('catalog.add_radio_cta') }}</v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h5">{{ $t('catalog.long_title') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('catalog.radio_name') }}
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>

            <tr v-if="catalog_radios.length > 0" v-for="item in catalog_radios" :key="item.id">
              <td>
                <NuxtLink :to="'/catalog/' + item.id + '/'">
                  <v-icon v-if="display.smAndUp" icon="mdi-radio" class="mr-4" />
                  <img :src="item.logo" class="app-image-thumbnail">
                  {{ item.name }}
                </NuxtLink>
              </td>
              <td :width="display.smAndUp ? '150' : '100'" style="padding: 0">

                <NuxtLink :to="'/catalog/' + item.id + '/'"><v-btn :density="display.smAndUp ? 'default' : 'compact'"
                    icon="mdi-pencil"></v-btn></NuxtLink>

                <!-- Catalog page link 
                <v-btn :density="display.smAndUp ? 'default' : 'compact'" :href="item.catalog_url" v-if="item.catalog_url"
                  target="_blank" icon="mdi-android"></v-btn>
                -->

                <v-btn icon="mdi-delete" @click="deleteRadio(item)"
                  :disabled="item.beingDeleted"></v-btn>
              </td>
            </tr>

            <tr v-else-if="radios_loading">
              <td colspan="10" class="text-center"><v-progress-circular indeterminate></v-progress-circular></td>
            </tr>

            <tr v-else>
              <td class="text-center" colspan="3">
                <br />
                {{ $t('catalog.radios_empty') }}
                <br /><br />
                <!-- Link to the catalog -->

                <v-btn color="primary" to="/catalog/0" class="mt-2">{{ $t('catalog.add_radio_cta') }}</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

    </v-row>

  </v-container>


  <v-dialog v-model="delRadioDialog" width="auto">
    <v-card>
      <v-card-text>
        <div class="py-12 text-center">
          <v-icon class="mb-6" color="error" icon="mdi-alert-decagram" size="128"></v-icon>

          <div class="text-h4 font-weight-bold">{{ $t('catalog.radio_delete_confirmation') }}</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey" @click="answerDialog(false)">{{ $t('cancel') }}</v-btn>
        <v-btn variant="outlined" color="primary" @click="answerDialog(true)">{{ $t('delete') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="deleteRadioFailed" color="error">
    {{ $t('catalog.radio_delete_failed') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteRadioFailed = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>


  <v-snackbar v-model="deleteRadioSuccess" color="success">
    {{ $t('catalog.radio_delete_success') }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="deleteRadioSuccess = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useDisplay } from "vuetify";
const config = useRuntimeConfig();
const display = ref(useDisplay())

let catalog_radios = ref([]);
let radios_loading = ref(false);
let answerDialog = ref();
let deleteRadioFailed = ref(false);
let deleteRadioSuccess = ref(false);
let delRadioDialog = ref(false);

definePageMeta({
  layout: "default",
});


async function reloadCatalogRadios() {
  let response;
  catalog_radios.value = [];
  radios_loading.value = true;
  try {
    response = await fetchAuth(`${config.public.baseURL}/catalog/radios/`);
  }
  catch (e) {
  }
  catalog_radios.value = response || [];
  radios_loading.value = false;
}

reloadCatalogRadios();

function deleteRadio(radio) {
  delRadioDialog.value = true;
  new Promise((resolve) => {
    answerDialog = resolve;
  }).then((res) => {
    delRadioDialog.value = false;
    if(res){
      clearNuxtData();
      radio.beingDeleted = true;

      fetchAuth(`${config.public.baseURL}/catalog/radios/${radio.id}/`, { method: 'DELETE' }).then(
        (r) => {
            deleteRadioSuccess.value = true;
            reloadCatalogRadios();
        },
        (e) => {
          deleteRadioFailed.value = true;
        }
      ).finally(() => {
        radio.beingDeleted = false;
      });
    }
  })
}
</script>
