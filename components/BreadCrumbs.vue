<template>
    <v-breadcrumbs :items="crumbs" icon="mdi-android">
        <template v-slot:prepend>
            <v-icon size="small" icon="mdi-home"></v-icon>
        </template>
        <template v-slot:title="{ item }">
            <NuxtLink :to="item.href" class="v-breadcrumbs-item v-breadcrumbs-item--link">
                {{ item.title }}
            </NuxtLink>
        </template>
    </v-breadcrumbs>
</template>

<script>

export default {
    name: "BreadCrumbs",
    data() {
        return {
            crumbs: [],
        }
    },
    watch: {
        $route(newRoute, oldRoute) {
            this.buildCrumbs(this.crumbs, newRoute)
        }
    },
    created() {
        this.buildCrumbs(this.crumbs, this.$route)
    },
    methods: {
        buildCrumbs(crumbs, route) {
            const fullPath = route.fullPath;
            const params = fullPath.startsWith('/')
                ? fullPath.substring(1).split('/')
                : fullPath.split('/')
            let path = ''
            this.crumbs = [];
            params.forEach((param, index) => {
                console.log(param, index)
                this.crumbs.push({
                    title: ('nav.' + param),
                    href: "/" + param
                })
            })
        },

    },
}
</script>