<template>
    App form {{ platform }} 
</template>


<script setup>
    const props = defineProps({platform: String, id: Number})
    console.log("platform: ", props.platform, props.id)

</script>