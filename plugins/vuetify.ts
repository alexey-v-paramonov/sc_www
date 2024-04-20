import { createVuetify } from "vuetify";
import { aliases, custom } from "~/components/icons/svgIcons";
import { mdi } from "vuetify/iconsets/mdi";

const lightTheme = {
    dark: false,
    colors: {
        primary: '#3369e8',
        secondary: '#00A6FF',
        info: '#E1F5F3',
        success: '#13DEB9',
        accent: '#008E59',
        warning: '#FFEFCA',
        error: '#CC4100',
        /*muted:'#5a6a85',
        lightprimary: '#ECF2FF',
        lightsecondary: '#E8F7FF',
        lightsuccess: '#E6FFFA',
        lighterror: '#FDEDE8',
        lightwarning: '#FEF5E5',*/
        textPrimary: '#2A3547',
        textSecondary: '#2A3547',
        borderColor: '#e5eaef',
        inputBorder: '#000',
        containerBg: '#ffffff',
        hoverColor: '#f6f9fc',
        surface: '#fff',
        'on-surface-variant': '#fff',
        grey100: '#F2F6FA',
        grey200: '#EAEFF4'
    },
};

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        ssr: true,
        theme: {
            defaultTheme: "light",
            themes: {
                "light": lightTheme,
            },
        },
        defaults: {
            VBtn: {
                elevation: 0,
            },
            VTextField:{
                variant:"outlined",
            },
            VTextarea:{
                variant:"outlined",
            },
            VSelect:{
                variant:"outlined",
            },
            VFileInput:{
                variant:"outlined",
            },
        },
        icons: {
            defaultSet: "mdi",
            iconfont: 'mdi',
            //aliases,
            sets: {
                mdi,
                custom: custom,
            },
        },
    });

    app.vueApp.use(vuetify);
});
