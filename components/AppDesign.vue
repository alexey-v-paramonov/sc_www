<template>
  <div class="design-form ma-sm-4 ma-1 mt-8 mt-sm-8">
    <v-form @submit.prevent="onAppDesignSubmit" :disabled="isAppDesignSubmitting">

      <v-row no-gutters md="12">
        <v-col cols="3" sm="6">
          <div class="picker-col">
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.bg_color') }}</div>
            <!--<v-color-picker v-model="bg_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="bg_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.bg_color_gradient') }}</div>
            <!--<v-color-picker v-model="bg_color_gradient.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="bg_color_gradient.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.font_color') }}</div>
            <!--<v-color-picker v-model="font_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="font_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.text_secondary_color') }}</div>
            <!--<v-color-picker v-model="text_secondary_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="text_secondary_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.button_text_color') }}</div>
            <!--<v-color-picker v-model="button_text_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="button_text_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.tabs_color') }}</div>
            <!--<v-color-picker v-model="tabs_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="tabs_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.tabs_icon_color') }}</div>
            <!--<v-color-picker v-model="tabs_icon_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="tabs_icon_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.tabs_icon_selected_color') }}</div>
            <!--<v-color-picker v-model="tabs_icon_selected_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="tabs_icon_selected_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.main_theme_color') }}</div>
            <!--<v-color-picker v-model="main_theme_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="main_theme_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.play_button_border_color') }}</div>
            <!--<v-color-picker v-model="play_button_border_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="play_button_border_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.volume_buttons_color') }}</div>
            <!--<v-color-picker v-model="volume_buttons_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="volume_buttons_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.volume_bar_active_color') }}</div>
            <!--<v-color-picker v-model="volume_bar_active_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
            <color-picker v-model:pureColor="volume_bar_active_color.value.value" format="hex"/>
          </div>
          <div class="picker-container text-uppercase mb-4">
          <div class="picker-title text-truncate">{{ $t('app.design.volume_bar_inactive_color') }}</div>
            <color-picker v-model:pureColor="volume_bar_inactive_color.value.value" format="hex"/>
            <!--<v-color-picker v-model="volume_bar_inactive_color.value.value" mode="rgb" :modes="['rgb',]"></v-color-picker>-->
          </div>
          </div>
        </v-col>

        <!-- Preview -->
        <v-col cols="9" sm="6" class="text-center">
          <div class="mobile-preview sticky-top">

            <div>
              <AppPreview
                  lang="en"
                  :bg_color="bg_color.value.value"
                  :bg_color_gradient="bg_color_gradient.value.value"
                  :font_color="font_color.value.value"
                  :button_text_color="button_text_color.value.value"
                  :text_secondary_color="text_secondary_color.value.value"
                  :main_theme_color="main_theme_color.value.value"
                  :play_button_border_color="play_button_border_color.value.value"
                  :tabs_color="tabs_color.value.value"
                  :tabs_icon_color="tabs_icon_color.value.value"
                  :tabs_icon_selected_color="tabs_icon_selected_color.value.value"
                  :volume_bar_active_color="volume_bar_active_color.value.value"
                  :volume_bar_inactive_color="volume_bar_inactive_color.value.value"
                  :volume_buttons_color="volume_buttons_color.value.value"
              />
            </div>

            <!-- <div><v-icon icon="mdi-cellphone" size="x-large" style="font-size: 300px;"></v-icon></div> -->


            <v-btn color="primary" @click="skinDialog = true;">{{ $t('app.design.choose_skin') }}</v-btn>
            <br/>
            <br/>
            <v-select v-if="otherApps.length > 0"
                      @update:modelValue="copyColors"
                      :hint="$t('app.design.copy_colors_hint')" :items="otherApps" item-title="title"
                      item-value="lookup"
                      :label="$t('app.design.copy_colors')" persistent-hint single-line>
            </v-select>

          </div>
        </v-col>

      </v-row>
      <v-row no-gutters md="12">
        <v-col>
          <v-btn type="submit" :disabled="isAppDesignSubmitting" block class="save-btn mt-2" color="primary">{{
              isAppDesignSubmitting ? $t('loading') : $t('save')
            }}
          </v-btn>
        </v-col>

      </v-row>
    </v-form>

    <v-dialog v-model="skinDialog" width="auto">
      <v-card>
        <v-card-text>
          <img src="/img/app_skins/skin1.png" style="max-height: 300px;" @click="selectSkin('1')"/>&nbsp;
          <img src="/img/app_skins/skin12.png" style="max-height: 300px;" @click="selectSkin('12')"/>&nbsp;
          <img src="/img/app_skins/skin2.png" style="max-height: 300px;" @click="selectSkin('2')"/>&nbsp;
          <img src="/img/app_skins/skin22.png" style="max-height: 300px;" @click="selectSkin('22')"/>&nbsp;
          <img src="/img/app_skins/skin3.png" style="max-height: 300px;" @click="selectSkin('3')"/>&nbsp;
          <img src="/img/app_skins/skin32.png" style="max-height: 300px;" @click="selectSkin('32')"/>&nbsp;
          <img src="/img/app_skins/skin4.png" style="max-height: 300px;" @click="selectSkin('4')"/>&nbsp;
          <img src="/img/app_skins/skin42.png" style="max-height: 300px;" @click="selectSkin('42')"/>&nbsp;
          <img src="/img/app_skins/skin5.png" style="max-height: 300px;" @click="selectSkin('5')"/>&nbsp;
          <img src="/img/app_skins/skin52.png" style="max-height: 300px;" @click="selectSkin('52')"/>&nbsp;
          <img src="/img/app_skins/skin6.png" style="max-height: 300px;" @click="selectSkin('6')"/>&nbsp;
          <img src="/img/app_skins/skin62.png" style="max-height: 300px;" @click="selectSkin('62')"/>
        </v-card-text>
      </v-card>


      <v-btn color="primary" block @click="skinDialog = false">{{ $t('close') }}</v-btn>
    </v-dialog>

  </div>
</template>

<script setup>
// https://www.codeply.com/p/UlWxdd02jP
import {ColorPicker} from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import {ref, onMounted} from 'vue';
import {useField, useForm} from 'vee-validate';

const emit = defineEmits(['AppInfoRefresh',])
const props = defineProps({platform: String, id: Number, appData: Object})
const config = useRuntimeConfig();

let skinDialog = ref(false);

let SKINS = {
  "1": {
    "bg_color": "f2f2f2",
    "bg_color_gradient": "f2f2f2",
    "font_color": "000000",
    "button_text_color": "dadada",
    //"text_secondary_color": "ffffff",
    "main_theme_color": "333333",
    "play_button_border_color": "8F8E94",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "ff9500",
    "text_secondary_color": "333333",
    "volume_bar_active_color": "333333",
    "volume_bar_inactive_color": "dddddd",
    "volume_buttons_color": "333333"
  },
  "12": {
    "bg_color": "e1e1e1",
    "bg_color_gradient": "e1e1e1",
    "font_color": "000000",
    "button_text_color": "dadada",
    //"text_secondary_color": "ffffff",
    "main_theme_color": "333333",
    "play_button_border_color": "8F8E94",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "ff9500",
    "text_secondary_color": "333333",
    "volume_bar_active_color": "333333",
    "volume_bar_inactive_color": "dddddd",
    "volume_buttons_color": "333333"
  },
  "2": {
    "bg_color": "241333",
    "bg_color_gradient": "241333",
    "font_color": "FFFFFF",
    "button_text_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "main_theme_color": "D47FA6",
    "play_button_border_color": "8F8E94",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "D47FA6",
    "text_secondary_color": "93889B",
    "volume_bar_active_color": "d47fa6",
    "volume_bar_inactive_color": "93879b",
    "volume_buttons_color": "93879b"
  },
  "22": {
    "bg_color": "170b1f",
    "bg_color_gradient": "352740",
    "font_color": "FFFFFF",
    "button_text_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "main_theme_color": "D47FA6",
    "play_button_border_color": "8F8E94",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "D47FA6",
    "text_secondary_color": "93889B",
    "volume_bar_active_color": "d47fa6",
    "volume_bar_inactive_color": "93879b",
    "volume_buttons_color": "93879b"
  },
  "3": {
    "bg_color": "3b3a98",
    "bg_color_gradient": "3b3a98",
    "font_color": "FFFFFF",
    "button_text_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "main_theme_color": "B2B6FF",
    "play_button_border_color": "B2B6FF",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "B2B6FF",
    "text_secondary_color": "B2B6FF",
    "volume_bar_active_color": "b2b6ff",
    "volume_bar_inactive_color": "685bc4",
    "volume_buttons_color": "dadada"
  },
  "32": {
    "bg_color": "25245e",
    "bg_color_gradient": "474791",
    "font_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "button_text_color": "FFFFFF",
    "main_theme_color": "B2B6FF",
    "play_button_border_color": "B2B6FF",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "B2B6FF",
    "text_secondary_color": "B2B6FF",
    "volume_bar_active_color": "b2b6ff",
    "volume_bar_inactive_color": "685bc4",
    "volume_buttons_color": "dadada"
  },
  "4": {
    "bg_color": "016742",
    "bg_color_gradient": "016742",
    "font_color": "FFFFFF",
    "button_text_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "main_theme_color": "ABE8F2",
    "play_button_border_color": "A7E8F5",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "ABE8F2",
    "text_secondary_color": "A6EBF1",
    "volume_bar_active_color": "abe9f4",
    "volume_bar_inactive_color": "55a79b",
    "volume_buttons_color": "918899"
  },
  "42": {
    "bg_color": "004028",
    "bg_color_gradient": "176a4c",
    "font_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "button_text_color": "FFFFFF",
    "main_theme_color": "ABE8F2",
    "play_button_border_color": "A7E8F5",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "ABE8F2",
    "text_secondary_color": "A6EBF1",
    "volume_bar_active_color": "abe9f4",
    "volume_bar_inactive_color": "55a79b",
    "volume_buttons_color": "918899"
  },
  "5": {
    "bg_color": "6d0458",
    "bg_color_gradient": "6d0458",
    "font_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "button_text_color": "FFFFFF",
    "main_theme_color": "F2A2AD",
    "play_button_border_color": "F2A2AD",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "F2A2AD",
    "text_secondary_color": "F2A2AD",
    "volume_bar_active_color": "f2a2ad",
    "volume_bar_inactive_color": "b05382",
    "volume_buttons_color": "938899"
  },
  "52": {
    "bg_color": "430335",
    "bg_color_gradient": "701b5e",
    "font_color": "FFFFFF",
    //"text_secondary_color": "ffffff",
    "button_text_color": "FFFFFF",
    "main_theme_color": "F2A2AD",
    "play_button_border_color": "F2A2AD",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "F2A2AD",
    "text_secondary_color": "F2A2AD",
    "volume_bar_active_color": "f2a2ad",
    "volume_bar_inactive_color": "b05382",
    "volume_buttons_color": "938899"
  },
  "6": {
    "bg_color": "f1f8fe",
    "bg_color_gradient": "f1f8fe",
    "font_color": "2F80ED",
    "button_text_color": "dadada",
    //"text_secondary_color": "2F80ED",
    "main_theme_color": "6DA8FF",
    "play_button_border_color": "6DA8FF",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "6DA8FF",
    "text_secondary_color": "2F80ED",
    "volume_bar_active_color": "6ca8fe",
    "volume_bar_inactive_color": "dddddf",
    "volume_buttons_color": "6ca8fe"
  },
  "62": {
    "bg_color": "e2e7ed",
    "bg_color_gradient": "e2e7ed",
    "font_color": "2F80ED",
    "button_text_color": "dadada",
    //"text_secondary_color": "2F80ED",
    "main_theme_color": "6DA8FF",
    "play_button_border_color": "6DA8FF",
    "tabs_color": "161616",
    "tabs_icon_color": "dadada",
    "tabs_icon_selected_color": "6DA8FF",
    "text_secondary_color": "2F80ED",
    "volume_bar_active_color": "6ca8fe",
    "volume_bar_inactive_color": "dddddf",
    "volume_buttons_color": "6ca8fe"
  }
};

const otherApps = ref([]);
let appsAndroid = [];
let appsIos = [];


const {handleSubmit, isSubmitting: isAppDesignSubmitting} = useForm({
  initialValues: props.appData
});

const bg_color = useField('bg_color');
const bg_color_gradient = useField('bg_color_gradient');
const font_color = useField('font_color');
const text_secondary_color = useField('text_secondary_color');
const button_text_color = useField('button_text_color');
const tabs_color = useField('tabs_color');
const tabs_icon_color = useField('tabs_icon_color');
const tabs_icon_selected_color = useField('tabs_icon_selected_color');
const main_theme_color = useField('main_theme_color');
const play_button_border_color = useField('play_button_border_color');
const volume_buttons_color = useField('volume_buttons_color');
const volume_bar_active_color = useField('volume_bar_active_color');
const volume_bar_inactive_color = useField('volume_bar_inactive_color');


function selectSkin(skinNumber) {
  const skin = SKINS[skinNumber];
  bg_color.value.value = `#${skin["bg_color"]}`;
  bg_color_gradient.value.value = `#${skin["bg_color_gradient"]}`;
  font_color.value.value = `#${skin["font_color"]}`;
  text_secondary_color.value.value = `#${skin["text_secondary_color"]}`;
  button_text_color.value.value = `#${skin["button_text_color"]}`;
  tabs_color.value.value = `#${skin["tabs_color"]}`;
  tabs_icon_color.value.value = `#${skin["tabs_icon_color"]}`;
  tabs_icon_selected_color.value.value = `#${skin["tabs_icon_selected_color"]}`;
  main_theme_color.value.value = `#${skin["main_theme_color"]}`;
  play_button_border_color.value.value = `#${skin["play_button_border_color"]}`;
  volume_buttons_color.value.value = `#${skin["volume_buttons_color"]}`;
  volume_bar_active_color.value.value = `#${skin["volume_bar_active_color"]}`;
  volume_bar_inactive_color.value.value = `#${skin["volume_bar_inactive_color"]}`;

  skinDialog.value = false;
}

function isAndroid() {
  return props.platform == 'android';
}


async function appDesignUpdateRequest(values) {
  const platform = isAndroid() ? "android" : "ios";

  return await fetchAuth(`${config.public.baseURL}/mobile_apps/${platform}/${props.id}/`, {
    method: 'PATCH',
    body: {
      bg_color: bg_color.value.value,
      bg_color_gradient: bg_color_gradient.value.value,
      font_color: font_color.value.value,
      button_text_color: button_text_color.value.value,
      //text_secondary_color: text_secondary_color.value.value,
      main_theme_color: main_theme_color.value.value,
      play_button_border_color: play_button_border_color.value.value,
      tabs_color: tabs_color.value.value,
      tabs_icon_color: tabs_icon_color.value.value,
      tabs_icon_selected_color: tabs_icon_selected_color.value.value,
      text_secondary_color: text_secondary_color.value.value,
      volume_bar_active_color: volume_bar_active_color.value.value,
      volume_bar_inactive_color: volume_bar_inactive_color.value.value,
      volume_buttons_color: volume_buttons_color.value.value,
    }
  });
}

const onAppDesignSubmit = handleSubmit(async values => {

  let response;
  try {
    response = await appDesignUpdateRequest(values);
  } catch (e) {
    const errorData = e.data;
    for (const [field, errors] of Object.entries(errorData)) {
      for (const errCode of errors) {
        setErrors({[field]: t(`app.errors.${field}.${errCode}`)})
      }
    }
    return;
  }
  emit('AppInfoRefresh');
});


async function loadAllApplications() {

  appsAndroid = await fetchAuth(`${config.public.baseURL}/mobile_apps/android/`);
  appsIos = await fetchAuth(`${config.public.baseURL}/mobile_apps/ios/`);

  for (let androidApp of appsAndroid) {
    if (androidApp.id != props.id) {
      androidApp.title = 'Android: ' + androidApp.title;
      androidApp.lookup = 'android_' + androidApp.id;
      otherApps.value.push(androidApp);
    }
  }
  for (let iosApp of appsIos) {
    if (iosApp.id != props.id) {
      iosApp.title = 'iOS: ' + iosApp.title;
      iosApp.lookup = 'ios_' + iosApp.id;
      otherApps.value.push(iosApp);
    }
  }

}

function copyColors(srcApp) {
  const d = srcApp.split('_');
  const platform = d[0];
  const appID = d[1];
  let app = undefined;

  if (platform == 'android') {
    app = appsAndroid.find((app) => app.id == appID);
  } else if (platform == 'ios') {
    app = appsIos.find((app) => app.id == appID);
  }
  if (app) {
    bg_color.value.value = app.bg_color;
    bg_color_gradient.value.value = app.bg_color_gradient;
    font_color.value.value = app.font_color;
    text_secondary_color.value.value = app.text_secondary_color;
    button_text_color.value.value = app.button_text_color;
    tabs_color.value.value = app.tabs_color;
    tabs_icon_color.value.value = app.tabs_icon_color;
    tabs_icon_selected_color.value.value = app.tabs_icon_selected_color;
    main_theme_color.value.value = app.main_theme_color;
    play_button_border_color.value.value = app.play_button_border_color;
    volume_buttons_color.value.value = app.volume_buttons_color;
    volume_bar_active_color.value.value = app.volume_bar_active_color;
    volume_bar_inactive_color.value.value = app.volume_bar_inactive_color;
  }

}

onMounted(() => {
  loadAllApplications();
});

</script>

<style>
.vc-color-wrap{
  box-shadow: none !important;
}
.sticky-top {
  position: sticky;
  top: 10px;
}
.picker-title{
  font-weight: 600;
  font-size:11px;
  margin-bottom: 2px;
}
.mobile-preview svg{
  max-width:350px;
  width:100%;
}
@media (max-width: 600px) {

  .picker-col{
    position: absolute;
    z-index:1;
  }
  .picker-title{
    font-size:9px;
    max-width: 85px;
  }
  .design-form .save-btn{
    margin-top: 36px !important;
  }
}
</style>
