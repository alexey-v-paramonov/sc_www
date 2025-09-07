<template>
    <v-container>
        <v-row no-gutters>
            <v-col>
                <div class="text-h5 mb-4">{{ pageTitle }}</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <CatalogRadioForm :id="route.params.id" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed } from 'vue';
import CatalogRadioForm from '~/components/CatalogRadioForm.vue';

const route = useRoute();
const { t } = useI18n();

const isEditMode = computed(() => route.params.id && route.params.id != '0');

const pageTitle = computed(() => {
    return isEditMode.value ? t('catalog.radio.edit_title') : t('catalog.radio.add_title');
});

</script>