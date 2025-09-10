<template>
    <v-form @submit.prevent="onSubmit" :disabled="isSubmitting">
        <v-container>
            <v-row>
                <v-col cols="12" md="8">
                    <v-text-field v-model="name.value.value" :error-messages="name.errorMessage.value"
                        :label="$t('catalog.radio.name')" required></v-text-field>

                    <v-text-field v-model="website.value.value" :error-messages="website.errorMessage.value"
                        :label="$t('catalog.radio.website')" required></v-text-field>

                    <v-textarea v-model="description.value.value" :error-messages="description.errorMessage.value"
                        :label="$t('catalog.radio.description')"></v-textarea>

                    <v-select v-model="language.value.value" :items="languages" item-title="name" item-value="id"
                        :error-messages="language.errorMessage.value" :label="$t('catalog.radio.language')"
                        multiple chips></v-select>

                    <v-select v-model="country.value.value" :items="countries" item-title="name" item-value="id"
                        :error-messages="country.errorMessage.value" :label="$t('catalog.radio.country')"
                        @update:modelValue="onCountryChange"></v-select>

                    <v-select v-model="region.value.value" :items="regions" item-title="name" item-value="id"
                        :error-messages="region.errorMessage.value" :label="$t('catalog.radio.region')"
                        :disabled="!country.value.value" :loading="regionsLoading"
                        @update:modelValue="onRegionChange"></v-select>

                    <v-select v-model="city.value.value" :items="cities" item-title="name" item-value="id"
                        :error-messages="city.errorMessage.value" :label="$t('catalog.radio.city')"
                        :disabled="!country.value.value" :loading="citiesLoading"></v-select>

                    <div class="text-subtitle-1">{{ $t('catalog.radio.genres') }}</div>
                    <v-row>
                        <v-col v-for="n in 3" :key="n" cols="12" md="4">
                            <template v-for="(genre, index) in genres" :key="genre.id">
                                <v-checkbox v-if="index % 3 === (n - 1)" v-model="genresSelection.value.value"
                                    :label="genre.name" :value="genre.id" hide-details></v-checkbox>
                            </template>
                        </v-col>
                    </v-row>
                    <v-messages :active="genresSelection.errorMessage.value" :messages="genresSelection.errorMessage.value"
                        color="error" class="mt-1"></v-messages>

                </v-col>
                <v-col cols="12" md="4">
                    <v-file-input v-model="logo.value.value" :error-messages="logo.errorMessage.value"
                        :label="$t('catalog.radio.logo')" accept="image/*" @change="onFileChange" show-size
                        prepend-icon="mdi-image"></v-file-input>
                    <v-img v-if="logoPreview" :src="logoPreview" aspect-ratio="1" class="mt-4"></v-img>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn type="submit" color="primary" :loading="isSubmitting">
                        {{ isEditMode ? $t('save') : $t('create') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
    <v-snackbar v-model="submitSuccess" color="success">
        {{ $t('catalog.radio.save_success') }}
        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="submitSuccess = false">
                {{ $t('close') }}
            </v-btn>
        </template>
    </v-snackbar>
    <v-snackbar v-model="submitError" color="error">
        {{ submitErrorMessage || $t('catalog.radio.save_error') }}
        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="submitError = false">
                {{ $t('close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useForm, useField } from 'vee-validate';
// import { object, string, array, mixed } from 'yup';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    id: {
        type: [Number, String],
        required: true
    }
});

const { t } = useI18n();
const config = useRuntimeConfig();
const router = useRouter();

const isEditMode = computed(() => props.id && props.id != '0');
const logoPreview = ref(null);
const submitSuccess = ref(false);
const submitError = ref(false);
const submitErrorMessage = ref('');

// Data fetching
const { data: languages } = await useFetchAuth(`${config.public.baseURL}/catalog/languages/`);
const { data: countries } = await useFetchAuth(`${config.public.baseURL}/catalog/countries/`);
const { data: genres } = await useFetchAuth(`${config.public.baseURL}/catalog/genres/`);

const regions = ref([]);
const cities = ref([]);
const regionsLoading = ref(false);
const citiesLoading = ref(false);



const { handleSubmit, isSubmitting, setValues, setErrors } = useForm({
    //validationSchema,
    initialValues: {
        genres: []
    }
});

const name = useField('name', 'required');
const website = useField('website', 'required|url');
const description = useField('description');
const language = useField('language', 'required');
const country = useField('country', 'required');
const region = useField('region');
const city = useField('city');
const genresSelection = useField('genres', 'required');
const logo = useField('logo', 'image_square_dimensions:256,256');

const onCountryChange = async (countryId) => {
    region.value.value = null;
    city.value.value = null;
    regions.value = [];
    cities.value = [];

    if (!countryId) return;

    regionsLoading.value = true;
    citiesLoading.value = true;
    try {
        const [regionsData, citiesData] = await Promise.all([
            $fetch(`${config.public.baseURL}/catalog/regions/`, { params: { country_id: countryId } }),
            $fetch(`${config.public.baseURL}/catalog/cities/`, { params: { country_id: countryId } })
        ]);
        regions.value = regionsData;
        cities.value = citiesData;
    } catch (e) {
        console.error('Failed to load regions or cities', e);
    } finally {
        regionsLoading.value = false;
        citiesLoading.value = false;
    }
};

const onRegionChange = async (regionId) => {
    city.value.value = null;
    cities.value = [];

    const countryId = country.value.value;
    if (!countryId) return;

    citiesLoading.value = true;
    try {
        const params = { country_id: countryId };
        if (regionId) {
            params.region_id = regionId;
        }
        cities.value = await $fetch(`${config.public.baseURL}/catalog/cities/`, { params });
    } catch (e) {
        console.error('Failed to load cities', e);
    } finally {
        citiesLoading.value = false;
    }
};

onMounted(async () => {
    if (isEditMode.value) {
        try {
            const radioData = await $fetch(`${config.public.baseURL}/catalog/radios/${props.id}/`);

            const countryId = radioData.country?.id;
            const regionId = radioData.region?.id;

            if (countryId) {
                regionsLoading.value = true;
                citiesLoading.value = true;
                try {
                    const cityParams = { country_id: countryId };
                    if (regionId) {
                        cityParams.region_id = regionId;
                    }
                    const [regionsData, citiesData] = await Promise.all([
                        $fetch(`${config.public.baseURL}/catalog/regions/`, { params: { country_id: countryId } }),
                        $fetch(`${config.public.baseURL}/catalog/cities/`, { params: cityParams })
                    ]);
                    regions.value = regionsData;
                    cities.value = citiesData;
                } catch (e) {
                    console.error('Failed to load initial location data', e);
                } finally {
                    regionsLoading.value = false;
                    citiesLoading.value = false;
                }
            }

            setValues({
                name: radioData.name,
                website: radioData.website,
                description: radioData.description,
                language: radioData.language.map(l => l.id),
                country: radioData.country?.id,
                region: radioData.region?.id,
                city: radioData.city?.id,
                genres: radioData.genres.map(g => g.id),
            });
            if (radioData.logo) {
                logoPreview.value = radioData.logo;
            }
        } catch (e) {
            submitErrorMessage.value = t('catalog.radio.errors.load_failed');
            submitError.value = true;
        }
    }
});

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        logo.value.value = [file];
        const reader = new FileReader();
        reader.onload = (e) => {
            logoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        logo.value.value = null;
        logoPreview.value = null;
    }
};

const onSubmit = handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('website', values.website);
    formData.append('description', values.description);
    formData.append('country', values.country);
    if (values.region) {
        formData.append('region', values.region);
    }
    if (values.city) {
        formData.append('city', values.city);
    }
    values.language.forEach(langId => formData.append('language', langId));
    values.genres.forEach(genreId => formData.append('genres', genreId));

    if (values.logo && values.logo.length > 0) {
        formData.append('logo', values.logo[0]);
    }

    const url = isEditMode.value ? `${config.public.baseURL}/catalog/radios/${props.id}/` : `${config.public.baseURL}/catalog/radios/`;
    const method = isEditMode.value ? 'PUT' : 'POST';

    try {
        const response = await fetchAuth(url, {
            method,
            body: formData,
        });
        submitSuccess.value = true;
        if (!isEditMode.value) {
            setTimeout(() => router.push(`/catalog/${response.id}`), 1000);
        }
    } catch (e) {
        submitErrorMessage.value = e.data?.detail || t('catalog.radio.save_error');
        if (typeof e.data === 'object') {
            setErrors(e.data);
        }
        submitError.value = true;
    }
});

</script>
<style scoped>
.v-messages {
    font-size: 12px;
    padding-top: 4px;
}
</style>
