import { h } from "vue";
import type { IconSet, IconAliases, IconProps } from "vuetify";

import radio from "./radio.vue";
import home from "./home.vue";
import payment from "./payment.vue";
import account from "./account.vue";
import android from "./android.vue";
import apple from "./apple.vue";
import logout from "./logout.vue";

const customSvgNameToComponent: any = {
    home,
    radio,
    android,
    payment,
    account,
    apple,
    logout,
};

const aliases: IconAliases = {
    complete: "ph:check-circle",
    cancel: "ph:x-circle",
    close: "ph:x-circle",
    delete: "ph:trash",
    clear: "ph:x-circle",
    success: "ph:check-circle",
    info: "ph:info",
    warning: "ph:warning",
    error: "ph:x-circle",
    prev: "ph:caret-left",
    next: "ph:caret-right",
    checkboxOn: "ph:check-square-fill",
    checkboxOff: "ph:square",
    checkboxIndeterminate: "ph:square",
    delimiter: "ph:circle",
    sort: "ph:caret-up",
    expand: "ph:caret-down",
    menu: "heroicons:bars-2",
    subgroup: "ph:caret-down",
    dropdown: "ph:caret-down",
    radioOn: "ph:radio-button-fill",
    radioOff: "ph:circle",
    edit: "ph:pencil-simple",
    ratingEmpty: "ph:star",
    ratingFull: "ph:star-fill",
    ratingHalf: "ph:star-half-fill",
    loading: "ph:spinner",
    first: "ph:caret-double-left",
    last: "ph:caret-double-right",
    unfold: "ph:arrows-out",
    file: "ph:file",
    plus: "ph:plus",
    minus: "ph:minus",
};


const custom: IconSet = {
    component: (props: IconProps) =>  h(props.tag, [h(customSvgNameToComponent[props.icon as string], { class: 'v-icon__svg' })]),
};

/*
const custom: IconSet = {
    component: (props: IconProps) =>
        // Return render function
        h(radio, { class: 'v-icon__svg',  name: props.icon, tag: props.tag, disabled: props.disabled }),
};*/

// export both aliases and the custom object created
export { aliases, custom };
