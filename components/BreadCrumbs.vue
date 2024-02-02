
<template>
    <v-breadcrumbs :items="crumbs" icon="mdi-android">
        <template v-slot:prepend>
            <v-icon size="small" icon="mdi-home"></v-icon>
        </template>
        <template v-slot:title="{ item }">
            <NuxtLink v-if="item.href" :to="item.href" class="v-breadcrumbs-item v-breadcrumbs-item--link">
                {{ item.title }}
            </NuxtLink>
            <span v-else>
                {{ item.title }}
            </span>
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
            this.crumbs = [{
                title: this.$t("nav.home"), 
                href: "/"
            }];
            let no_href_paths = ['self_hosted', 'apps']
            let full_href = '';
            params.forEach((param, index) => {
                if(!param){
                    return;
                }
                full_href += `/${param}`;
                this.crumbs.push({
                    title: this.$t('nav.' + param),
                    href: no_href_paths.includes(param) ? undefined : full_href
                })
                console.log("HREF: ", param, no_href_paths.includes(param), full_href)
            })
        },

    },
}
</script>