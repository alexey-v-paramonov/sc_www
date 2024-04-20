
<template>
    <v-breadcrumbs ref="breadcrumbs" v-resize="onResize" :items="crumbs" icon="mdi-android">
        <template v-slot:prepend>
            <v-icon size="13px" icon="custom:home" class="ml-3" style="opacity: var(--v-medium-emphasis-opacity);"></v-icon>
        </template>
        <template v-slot:title="{ item }">
            <NuxtLink v-if="item.href" :to="item.href" class="v-breadcrumbs-item v-breadcrumbs-item--link">
              <span class="text-truncate d-block" style="max-width:var(--v-breadcrumbs-trancate-width)">{{ item.title }}</span>
            </NuxtLink>
            <span v-else>
              <span class="text-truncate d-block" style="max-width:var(--v-breadcrumbs-trancate-width)">{{ item.title }}</span>
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
    mounted() {
      this.onResize()
    },
  methods: {
        onResize(){
          // TODO need debounce
          //console.log('this.$refs.breadcrumbs.$el.clientWidth',this.$refs.breadcrumbs.$el.clientWidth)
          //console.log('window.innerWidth',window.innerWidth)
          if(this.$refs.breadcrumbs.$el.clientWidth + 50 > window.innerWidth) {
            let max = Math.floor((this.$refs.breadcrumbs.$el.clientWidth - 150) / this.crumbs.length)
            this.$refs.breadcrumbs.$el.style.cssText = "--v-breadcrumbs-trancate-width: "+max+"px;";
          }else{
            this.$refs.breadcrumbs.$el.style.cssText = "--v-breadcrumbs-trancate-width: none";
          }
        },
        buildCrumbs(crumbs, route) {
            const fullPath = route.fullPath;
            const params = fullPath.startsWith('/')
                ? fullPath.substring(1).split('/')
                : fullPath.split('/')
            let no_href_paths = ['self_hosted', 'apps']
            let full_href = '';
            this.crumbs = [{
                title: this.$t("nav.home"),
                href: "/"
            }];
            params.forEach((param, index) => {
                if(!param){
                    return;
                }
                full_href += `/${param}`;
                if(/\/apps\/android\/\d+/.test(full_href)){
                    this.crumbs.push({
                        title: this.$t('nav.android_app'),
                        href: undefined
                    })
                }
                else if(/\/apps\/ios\/\d+/.test(full_href)){
                    this.crumbs.push({
                        title: this.$t('nav.ios_app'),
                        href: undefined
                    })
                }
                else if(/\/radio\/self_hosted\/\d+/.test(full_href)){
                    this.crumbs.push({
                        title: this.$t('nav.selfhosted_radio'),
                        href: undefined
                    })
                }
                else{
                    this.crumbs.push({
                        title: this.$t('nav.' + param),
                        href: no_href_paths.includes(param) ? undefined : full_href
                    })
                }
            })
        },

    },
}
</script>
