<template>
    <v-container>
        <v-row no-gutters md="12">
            <v-col>
                <div class="text-h5">{{ $t('app.ios.title') }}</div>
            </v-col>
        </v-row>
    </v-container>
    <AppForm platform="ios" :id="route.params.id" />
</template>

<script setup>
const route = useRoute()
</script>