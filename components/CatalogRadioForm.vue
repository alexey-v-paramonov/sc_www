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


                    <div class="text-subtitle-1">{{ $t('catalog.radio.genres') }}</div>
                    <v-row>
                        <v-col v-for="n in 3" :key="n" cols="12" md="4">
                            <template v-for="(genre, index) in genres" :key="genre.id">
                                <v-checkbox density="compact" v-if="index % 3 === (n - 1)" v-model="genresSelection.value.value"
                                    :label="genre.name" :value="genre.id" hide-details
                                    :disabled="genresSelection.value.value && genresSelection.value.value.length >= 3 && !genresSelection.value.value.includes(genre.id)"></v-checkbox>
                            </template>
                        </v-col>
                    </v-row>
                    <v-messages :active="genresSelection.errorMessage.value"
                        :messages="genresSelection.errorMessage.value" color="error" class="mt-1"></v-messages>

                </v-col>
                <v-col cols="12" md="4">
                    <v-img v-if="logoPreview" :src="logoPreview" aspect-ratio="1" class="mb-4"></v-img>
                    <v-file-input v-model="logo.value.value" :error-messages="logo.errorMessage.value"
                        :label="$t('catalog.radio.logo')" accept="image/*" @change="onFileChange" show-size
                        prepend-icon="mdi-image"></v-file-input>
                    <v-autocomplete v-model="language.value.value" :items="languages" item-title="name" item-value="id"
                        :error-messages="language.errorMessage.value" :label="$t('catalog.radio.language')" multiple
                        chips></v-autocomplete>

                    <v-autocomplete v-model="country.value.value" :items="countries" item-title="name" item-value="id"
                        :error-messages="country.errorMessage.value" :label="$t('catalog.radio.country')"
                        @update:modelValue="onCountryChange"></v-autocomplete>

                    <v-autocomplete v-model="region.value.value" :items="regions"
                        :item-title="item => item.name || item.name_eng" item-value="id"
                        :error-messages="region.errorMessage.value" :label="$t('catalog.radio.region')"
                        :disabled="!country.value.value" :loading="regionsLoading"
                        @update:modelValue="onRegionChange"></v-autocomplete>

                    <v-autocomplete v-model="city.value.value" :items="cities"
                        :item-title="item => item.name || item.name_eng" item-value="id"
                        :error-messages="city.errorMessage.value" :label="$t('catalog.radio.city')"
                        :disabled="!country.value.value" :loading="citiesLoading"></v-autocomplete>

                </v-col>
            </v-row>

            <!-- Radio streams management -->
            <v-row cols="12">

                <v-col cols="12">

                    <!-- Streams section -->
                    <v-row class="mt-4">
                        <v-col cols="12">
                            <div class="text-h5 text-center">{{ $t('app.radio.channels.title') }}</div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th>{{ $t('app.radio.channels.stream_url') }}</th>
                                        <th>{{ $t('app.radio.channels.bitrate') }}</th>
                                        <th>{{ $t('app.radio.channels.audio_format') }}</th>
                                        <th>{{ $t('app.radio.channels.server_type') }}</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="streams.value.value && streams.value.value.length > 0"
                                        v-for="(stream, index) in streams.value.value" :key="index">
                                        <td><a :href="stream.stream_url" target="_blank">{{ stream.stream_url }}</a>
                                        </td>
                                        <td><span v-if="stream.server_type == 'hls'">-</span><span v-else>{{
                                                stream.bitrate }}kbps</span></td>
                                        <td>{{ getAudioFormat(stream.audio_format) }}</td>
                                        <td>{{ getServerType(stream.server_type) }}</td>
                                        <td><v-btn density="compact" icon="mdi-delete"
                                                @click="deleteChannel(index)"></v-btn></td>
                                    </tr>
                                    <tr v-else>
                                        <td class="text-center" colspan="5">
                                            <br />
                                            <v-alert v-if="streams.errorMessage.value" color="error"
                                                icon="mdi-message-alert" :text="$t('catalog.radio.errors.streams_empty')"></v-alert>
                                            <p v-else>{{ $t('app.radio.channels.empty') }}</p>
                                            <br />
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>

                    <!-- New stream form -->
                    <v-row no-gutters>
                        <v-col cols="12">
                            <div class="text-h5 text-center mt-4">{{ $t('app.radio.channels.add_new_title') }}</div>
                            <v-row>
                                <v-col cols="12">

                                    <v-text-field v-model="new_channel_stream_url.value.value" 
                                        type="url" :error-messages="new_channel_stream_url.errorMessage.value"
                                        maxlength="200" name="new_channel_stream_url"
                                        :label="$t('app.radio.channels.stream_url')"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="4" v-if="new_channel_server_type.value.value != 'hls'">
                                    <v-select v-model="new_channel_bitrate.value.value" 
                                        :items="BITRATES_MP3" item-title="id" item-value="id"
                                        :label="$t('app.radio.channels.bitrate')" single-line></v-select>
                                </v-col>
                                <v-col cols="4">
                                    <v-select v-model="new_channel_audio_format.value.value" 
                                        :items="AUDIO_FORMATS" item-title="title" item-value="value"
                                        :label="$t('app.radio.channels.audio_format')" single-line></v-select>
                                </v-col>
                                <v-col cols="4">
                                    <v-select v-model="new_channel_server_type.value.value" 
                                        :items="SERVER_TYPES" item-title="title" item-value="value"
                                        :label="$t('app.radio.channels.server_type')" single-line></v-select>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-btn block class="mt-2" @click="addStream()" color="secondary">{{
                                        $t('app.radio.channels.add_new') }}</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
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
import { ref, computed, onMounted, watch } from 'vue';
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

const AUDIO_FORMATS = [{ "value": "mp3", "title": 'MP3' }, { "value": "aac", "title": 'AAC' }, { "value": "flac", "title": 'FLAC' }];
const BITRATES_MP3 = [16, 24, 32, 48, 64, 96, 128, 160, 192, 256, 320];
const SERVER_TYPES = [{ "value": "icecast", "title": 'Icecast' }, { "value": "shoutcast", "title": 'Shoutcast' }, { "value": "hls", "title": 'HLS' }];

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
        genres: [],
        streams: [],
    }
});

const name = useField('name', 'required');
const website = useField('website', 'required|url');
const description = useField('description');
const language = useField('language', 'required|max:3');
const country = useField('country', 'required');
const region = useField('region');
const city = useField('city');
const genresSelection = useField('genres', 'required|max:3');
const logo = useField('logo', computed(() => {
    return isEditMode.value
        ? 'image_square_dimensions:256,256'
        : 'required|image_square_dimensions:256,256';
}));

const streams = useField('streams', 'required');

const new_channel_stream_url = useField('new_channel_stream_url', "url");
const new_channel_bitrate = useField('new_channel_bitrate');
const new_channel_audio_format = useField('new_channel_audio_format');
const new_channel_server_type = useField('new_channel_server_type');

new_channel_bitrate.value.value = 128;
new_channel_audio_format.value.value = AUDIO_FORMATS[0].value;
new_channel_server_type.value.value = SERVER_TYPES[0].value;


watch(language.value, (newValue) => {
    if (newValue && newValue.length > 3) {
        language.value.value.pop();
    }
});

function getAudioFormat(v) {
    const format = AUDIO_FORMATS.find((t) => t.value == v);
    return format ? format.title : '';
}

function getServerType(v) {
    const serverType = SERVER_TYPES.find((t) => t.value == v);
    return serverType ? serverType.title : '';
}

function addStream() {
    if (!new_channel_stream_url.value.value) {
        setErrors({ ['new_channel_stream_url']: t(`errors.required`) });
        return;
    }
    if (new_channel_server_type.value.value == 'hls') {
        var parser = document.createElement('a');
        parser.href = new_channel_stream_url.value.value;
        if (parser.pathname.split('.').pop().toLowerCase() != 'm3u8') {
            setErrors({ ['new_channel_stream_url']: t(`app.errors.hls_not_m3u8`) });
            return;
        }
    }

    const currentStreams = streams.value.value || [];
    streams.value.value = [...currentStreams, {
        stream_url: new_channel_stream_url.value.value,
        bitrate: new_channel_bitrate.value.value,
        audio_format: new_channel_audio_format.value.value,
        server_type: new_channel_server_type.value.value,
    }];

    new_channel_stream_url.value.value = '';
    new_channel_bitrate.value.value = 128;
    new_channel_audio_format.value.value = AUDIO_FORMATS[0].value;
    new_channel_server_type.value.value = SERVER_TYPES[0].value;
    new_channel_stream_url.resetField();
}

function deleteChannel(channel_index) {
    const currentStreams = streams.value.value || [];
    currentStreams.splice(channel_index, 1);
    streams.value.value = [...currentStreams];
}

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
                streams: radioData.streams || [],
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

    if (values.streams && values.streams.length > 0) {
        ///var blob = new Blob([JSON.stringify(values.streams)], { type: "application/json" });
        var blob = JSON.stringify(values.streams);
        formData.append('streams', blob);
    }

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
