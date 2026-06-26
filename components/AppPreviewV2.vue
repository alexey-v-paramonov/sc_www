<template>
  <svg viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Roboto, Arial, sans-serif">
    <defs>
      <clipPath id="v2_clip">
        <rect width="375" height="812" rx="0" />
      </clipPath>
      <clipPath id="v2_cover_clip">
        <rect x="92.5" y="120" width="190" height="190" rx="24" />
      </clipPath>
      <filter id="v2_bg_blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
    </defs>

    <g clip-path="url(#v2_clip)">

      <!-- ===== Background: blurred uploaded logo (or generic mark) ===== -->
      <rect width="375" height="812" fill="#1b1b1f" />
      <template v-if="logo">
        <image :href="logo" x="-60" y="60" width="495" height="690"
               preserveAspectRatio="xMidYMid slice" filter="url(#v2_bg_blur)" />
      </template>
      <template v-else>
        <g filter="url(#v2_bg_blur)" opacity="0.6">
          <use href="#v2_generic_logo" transform="translate(-30, 120) scale(2.3)" />
        </g>
      </template>
      <!-- dim overlay -->
      <rect width="375" height="812" fill="#000000" fill-opacity="0.32" />

      <!-- ===== Header row ===== -->
      <!-- hamburger (left) -->
      <g :fill="font_color">
        <rect x="20" y="50" width="20" height="2.2" rx="1.1" />
        <rect x="20" y="56" width="20" height="2.2" rx="1.1" />
        <rect x="20" y="62" width="20" height="2.2" rx="1.1" />
      </g>
      <!-- title (centered) -->
      <text x="187.5" y="61" text-anchor="middle" font-size="17" font-weight="700"
            :fill="font_color">Internet Radio</text>
      <!-- settings gear (right) -->
      <g :fill="font_color" transform="translate(345, 57)">
        <circle cx="0" cy="0" r="4.2" fill="none" :stroke="font_color" stroke-width="2.4" />
        <g stroke="none">
          <rect x="-1.3" y="-10" width="2.6" height="5" rx="1.3" />
          <rect x="-1.3" y="5" width="2.6" height="5" rx="1.3" />
          <rect x="-10" y="-1.3" width="5" height="2.6" rx="1.3" />
          <rect x="5" y="-1.3" width="5" height="2.6" rx="1.3" />
          <rect x="-8" y="-8" width="2.6" height="5" rx="1.3" transform="rotate(-45 -6.7 -5.5)" />
          <rect x="5.4" y="3" width="2.6" height="5" rx="1.3" transform="rotate(-45 6.7 5.5)" />
          <rect x="3" y="-8" width="2.6" height="5" rx="1.3" transform="rotate(45 4.3 -5.5)" />
          <rect x="-8" y="3" width="2.6" height="5" rx="1.3" transform="rotate(45 -6.7 5.5)" />
        </g>
      </g>

      <!-- ===== Quality selector pill ===== -->
      <rect x="142.5" y="80" width="90" height="22" rx="11"
            :fill="text_secondary_color" fill-opacity="0.16" />
      <text x="187.5" y="95" text-anchor="middle" font-size="11" font-weight="500"
            :fill="text_secondary_color">320 kbps mp3</text>

      <!-- ===== Center cover art ===== -->
      <g clip-path="url(#v2_cover_clip)">
        <rect x="92.5" y="120" width="190" height="190" fill="#0e0e10" />
        <template v-if="logo">
          <image :href="logo" x="92.5" y="120" width="190" height="190"
                 preserveAspectRatio="xMidYMid slice" />
        </template>
        <template v-else>
          <use href="#v2_generic_logo" transform="translate(112.5, 140) scale(1.0)" />
        </template>
      </g>

      <!-- ===== Track title / artist ===== -->
      <text x="187.5" y="345" text-anchor="middle" font-size="18" font-weight="700"
            :fill="font_color">Now Playing</text>
      <text x="187.5" y="369" text-anchor="middle" font-size="13" font-weight="400"
            :fill="text_secondary_color">Live Stream</text>

      <!-- ===== Waveform visualizer ===== -->
      <g :fill="main_theme_color">
        <rect v-for="(h, i) in bars" :key="i"
              :x="42 + i * 7" :y="420 - h" width="3.4" :height="h" rx="1.7" />
      </g>

      <!-- ===== Time + source link ===== -->
      <text x="42" y="452" font-size="11" :fill="text_secondary_color">0:00:00</text>
      <text x="333" y="452" text-anchor="end" font-size="11" font-weight="500"
            text-decoration="underline" :fill="font_color">internetradio.com</text>

      <!-- ===== Playback controls ===== -->
      <!-- dislike -->
      <g transform="translate(60, 510)">
        <circle cx="0" cy="0" r="20" :fill="font_color" fill-opacity="0.10" />
        <path d="M-6 -7 H4 a2 2 0 0 1 2 2 v5 a2 2 0 0 1 -2 2 H1 l1 4 a2 2 0 0 1 -4 1 l-2 -5 H-6 z M-9 -7 H-6 V0 H-9 z"
              :fill="main_theme_color" transform="rotate(180)" />
      </g>
      <!-- previous -->
      <g transform="translate(120, 510)" :fill="main_theme_color">
        <path d="M6 -9 L-4 0 L6 9 Z" />
        <rect x="-7" y="-9" width="2.6" height="18" rx="1.3" />
      </g>
      <!-- play / pause -->
      <circle cx="187.5" cy="510" r="42" :fill="volume_bar_active_color" />
      <path d="M 187.5 468 A 42 42 0 1 1 150.8 530"
            :stroke="main_theme_color" stroke-width="5" stroke-linecap="round" fill="none" />
      <circle cx="187.5" cy="510" r="32" :fill="volume_bar_inactive_color" />
      <g :fill="main_theme_color">
        <rect x="180" y="498" width="6" height="24" rx="2" />
        <rect x="189" y="498" width="6" height="24" rx="2" />
      </g>
      <!-- next -->
      <g transform="translate(255, 510)" :fill="main_theme_color">
        <path d="M-6 -9 L4 0 L-6 9 Z" />
        <rect x="4.4" y="-9" width="2.6" height="18" rx="1.3" />
      </g>
      <!-- like -->
      <g transform="translate(315, 510)">
        <circle cx="0" cy="0" r="20" :fill="font_color" fill-opacity="0.10" />
        <path d="M-6 -7 H4 a2 2 0 0 1 2 2 v5 a2 2 0 0 1 -2 2 H1 l1 4 a2 2 0 0 1 -4 1 l-2 -5 H-6 z M-9 -7 H-6 V0 H-9 z"
              :fill="main_theme_color" />
      </g>

      <!-- ===== Volume row ===== -->
      <!-- speaker minus -->
      <g transform="translate(28, 600)" :fill="volume_buttons_color">
        <path d="M-8 -3 H-4 L1 -7 V7 L-4 3 H-8 Z" />
        <rect x="4" y="-1.3" width="8" height="2.6" rx="1.3" />
      </g>
      <!-- track inactive -->
      <rect x="46" y="598.5" width="283" height="3" rx="1.5" :fill="volume_bar_inactive_color" />
      <!-- track active -->
      <rect x="46" y="598.5" width="160" height="3" rx="1.5" :fill="volume_bar_active_color" />
      <!-- thumb -->
      <circle cx="206" cy="600" r="7" :fill="main_theme_color" />
      <!-- speaker plus -->
      <g transform="translate(340, 600)" :fill="volume_buttons_color">
        <path d="M-8 -3 H-4 L1 -7 V7 L-4 3 H-8 Z" />
        <rect x="3" y="-1.3" width="8" height="2.6" rx="1.3" />
        <rect x="5.7" y="-4" width="2.6" height="8" rx="1.3" />
      </g>

      <!-- ===== Bottom navigation ===== -->
      <rect x="0" y="742" width="375" height="70" :fill="tabs_color" />
      <g v-for="(tab, i) in tabs" :key="tab.id"
         :transform="`translate(${37.5 + i * 75}, 766)`"
         :fill="i === 0 ? tabs_icon_selected_color : tabs_icon_color">
        <!-- Player -->
        <g v-if="tab.id === 'player'">
          <circle cx="0" cy="0" r="11" fill="none"
                  :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.6" />
          <path d="M-3 -5 L6 0 L-3 5 Z" />
        </g>
        <!-- Jukebox (search) -->
        <g v-else-if="tab.id === 'jukebox'">
          <circle cx="-2" cy="-2" r="7" fill="none"
                  :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.8" />
          <rect x="3" y="3" width="9" height="2.2" rx="1.1" transform="rotate(45 4 4)" />
        </g>
        <!-- Stream (history clock) -->
        <g v-else-if="tab.id === 'stream'">
          <path d="M-11 -3 A 11 11 0 1 0 -7 -8" fill="none"
                :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.8" />
          <path d="M-11 -9 L-11 -3 L-5 -3" fill="none"
                :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.8" />
          <path d="M0 -6 L0 0 L4 3" fill="none"
                :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.8" stroke-linecap="round" />
        </g>
        <!-- Timer -->
        <g v-else-if="tab.id === 'timer'">
          <circle cx="0" cy="1" r="10" fill="none"
                  :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.8" />
          <rect x="-4" y="-12" width="8" height="2.4" rx="1.2" />
          <path d="M0 1 L0 -4 M0 1 L4 4" fill="none"
                :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.8" stroke-linecap="round" />
        </g>
        <!-- Info -->
        <g v-else>
          <circle cx="0" cy="0" r="11" fill="none"
                  :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color" stroke-width="1.6" />
          <circle cx="0" cy="-4.5" r="1.4" />
          <rect x="-1.2" y="-1.5" width="2.4" height="8" rx="1.2" />
        </g>
        <text x="0" y="26" text-anchor="middle" font-size="9.5"
              :fill="i === 0 ? tabs_icon_selected_color : tabs_icon_color">{{ tab.label }}</text>
      </g>

      <!-- ===== Reusable generic "internet radio" logo mark ===== -->
      <defs>
        <g id="v2_generic_logo">
          <!-- rounded backdrop -->
          <rect x="0" y="0" width="150" height="150" rx="28" fill="#2a2a32" />
          <!-- broadcast tower base -->
          <g transform="translate(75, 96)" fill="#e6e6ea">
            <path d="M-4 0 L-12 34 L12 34 L4 0 Z" />
            <rect x="-2" y="-2" width="4" height="20" />
          </g>
          <!-- broadcast waves -->
          <g transform="translate(75, 60)" fill="none" stroke="#7c4dff" stroke-width="4" stroke-linecap="round">
            <circle cx="0" cy="0" r="6" fill="#7c4dff" stroke="none" />
            <path d="M-16 -16 A 22 22 0 0 1 16 -16" />
            <path d="M-28 -28 A 40 40 0 0 1 28 -28" />
          </g>
        </g>
      </defs>

    </g>
  </svg>
</template>

<script setup>
const props = defineProps({
  "lang": { type: String, required: false, default: 'en' },
  "logo": { type: String, required: false, default: '' },
  "font_color": { type: String, required: false, default: '' },
  "button_text_color": { type: String, required: false, default: '' },
  "text_secondary_color": { type: String, required: false, default: '' },
  "main_theme_color": { type: String, required: false, default: '' },
  "play_button_border_color": { type: String, required: false, default: '' },
  "tabs_color": { type: String, required: false, default: '' },
  "tabs_icon_color": { type: String, required: false, default: '' },
  "tabs_icon_selected_color": { type: String, required: false, default: '' },
  "volume_bar_active_color": { type: String, required: false, default: '' },
  "volume_bar_inactive_color": { type: String, required: false, default: '' },
  "volume_buttons_color": { type: String, required: false, default: '' }
});

const { lang } = toRefs(props);
const { logo } = toRefs(props);
const { font_color } = toRefs(props);
const { button_text_color } = toRefs(props);
const { text_secondary_color } = toRefs(props);
const { main_theme_color } = toRefs(props);
const { play_button_border_color } = toRefs(props);
const { tabs_color } = toRefs(props);
const { tabs_icon_color } = toRefs(props);
const { tabs_icon_selected_color } = toRefs(props);
const { volume_bar_active_color } = toRefs(props);
const { volume_bar_inactive_color } = toRefs(props);
const { volume_buttons_color } = toRefs(props);

// Static waveform bar heights (decorative)
const bars = [6, 10, 16, 22, 14, 9, 18, 26, 20, 12, 8, 15, 24, 30, 22, 13, 7,
              11, 19, 27, 21, 14, 9, 17, 25, 18, 11, 7, 13, 20, 28, 23, 15, 10,
              6, 12, 18, 24, 16, 9, 14];

const tabLabels = computed(() => {
  const ru = lang.value === 'ru';
  return {
    player: ru ? 'Плеер' : 'Player',
    jukebox: ru ? 'Музыка' : 'Jukebox',
    stream: ru ? 'Эфир' : 'Stream',
    timer: ru ? 'Таймер' : 'Timer',
    info: ru ? 'Инфо' : 'Info'
  };
});

const tabs = computed(() => [
  { id: 'player', label: tabLabels.value.player },
  { id: 'jukebox', label: tabLabels.value.jukebox },
  { id: 'stream', label: tabLabels.value.stream },
  { id: 'timer', label: tabLabels.value.timer },
  { id: 'info', label: tabLabels.value.info }
]);
</script>
