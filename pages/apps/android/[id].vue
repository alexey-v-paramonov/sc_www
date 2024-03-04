<template>
    <v-container>
        <v-row no-gutters md="12">
            <v-col>
                <div class="text-h5">{{ $t('app.android.title') }}</div>
            </v-col>
        </v-row>
    </v-container>
    
    <AppForm platform="android" :id="parseInt(route.params.id)" />
</template>

<script setup>
    const route = useRoute()
</script>