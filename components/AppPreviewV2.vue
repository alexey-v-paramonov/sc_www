<template>
  <svg viewBox="0 0 375 700" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Roboto, Arial, sans-serif">
    <defs>
      <clipPath id="v2_clip">
        <rect width="375" height="700" rx="0" />
      </clipPath>
      <clipPath id="v2_cover_clip">
        <rect x="69" y="118" width="237" height="237" rx="28" />
      </clipPath>
      <filter id="v2_bg_blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
    </defs>

    <g clip-path="url(#v2_clip)">

      <!-- ===== Background: blurred uploaded logo (or generic mark) ===== -->
      <rect width="375" height="700" fill="#1b1b1f" />
      <template v-if="logo">
        <image :href="logo" x="-60" y="0" width="495" height="700"
               preserveAspectRatio="xMidYMid slice" filter="url(#v2_bg_blur)" />
      </template>
      <template v-else>
        <g filter="url(#v2_bg_blur)" opacity="0.6">
          <use href="#v2_generic_logo" transform="translate(-30, 90) scale(2.3)" />
        </g>
      </template>
      <!-- dim overlay -->
      <rect width="375" height="700" fill="#000000" fill-opacity="0.32" />

      <!-- ===== Header row ===== -->
      <!-- hamburger (left) — ic_baseline_menu_24 -->
      <svg x="20" y="43" width="22" height="22" viewBox="0 0 24 24">
        <path :fill="font_color" d="M3,18h18v-2L3,16v2zM3,13h18v-2L3,11v2zM3,6v2h18L21,6L3,6z" />
      </svg>
      <!-- title (centered) -->
      <text x="187.5" y="60" text-anchor="middle" font-size="17" font-weight="700"
            :fill="font_color">Internet Radio</text>
      <!-- settings gear (right) — matches gera.png (solid 6-knob gear, hollow centre) -->
      <svg x="332" y="42" width="24" height="24" viewBox="0 0 24 24">
        <path :fill="font_color" fill-rule="evenodd" clip-rule="evenodd"
              d="M12 1.6a2.6 2.6 0 0 0-2.6 2.6c0 .2 0 .4.05.6a8.1 8.1 0 0 0-1.86 1.08 2.6 2.6 0 1 0-2.93 4.04A8.2 8.2 0 0 0 4.6 12c0 .37.03.73.08 1.08a2.6 2.6 0 1 0 2.93 4.04 8.1 8.1 0 0 0 1.84 1.07c-.03.2-.05.4-.05.61a2.6 2.6 0 1 0 5.2 0c0-.2-.02-.41-.05-.61a8.1 8.1 0 0 0 1.84-1.07 2.6 2.6 0 1 0 2.93-4.04c.05-.35.08-.71.08-1.08 0-.37-.03-.73-.08-1.08a2.6 2.6 0 1 0-2.93-4.04A8.1 8.1 0 0 0 14.55 4.8c.03-.2.05-.4.05-.6A2.6 2.6 0 0 0 12 1.6Zm0 7a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z" />
      </svg>

      <!-- ===== Quality selector pill ===== -->
      <rect x="142.5" y="80" width="90" height="22" rx="11"
            :fill="text_secondary_color" fill-opacity="0.16" />
      <text x="187.5" y="95" text-anchor="middle" font-size="11" font-weight="500"
            :fill="text_secondary_color">320 kbps mp3</text>

      <!-- ===== Center cover art ===== -->
      <g clip-path="url(#v2_cover_clip)">
        <rect x="69" y="118" width="237" height="237" fill="#0e0e10" />
        <template v-if="logo">
          <image :href="logo" x="69" y="118" width="237" height="237"
                 preserveAspectRatio="xMidYMid slice" />
        </template>
        <template v-else>
          <use href="#v2_generic_logo" transform="translate(112.5, 158.5) scale(1.0)" />
        </template>
      </g>

      <!-- ===== Track title / artist ===== -->
      <text x="187.5" y="392" text-anchor="middle" font-size="18" font-weight="700"
            :fill="font_color">Now Playing</text>
      <text x="187.5" y="416" text-anchor="middle" font-size="13" font-weight="400"
            :fill="text_secondary_color">Live Stream</text>

      <!-- ===== Waveform visualizer ===== -->
      <g :fill="main_theme_color">
        <rect v-for="(h, i) in bars" :key="i"
              :x="42 + i * 7" :y="466 - h" width="3.4" :height="h" rx="1.7" />
      </g>

      <!-- ===== Time + source link (placed close to the waveform) ===== -->
      <text x="42" y="488" font-size="11" :fill="text_secondary_color">0:00:00</text>
      <text x="333" y="488" text-anchor="end" font-size="11" font-weight="500"
            text-decoration="underline" :fill="font_color">internetradio.com</text>

      <!-- ===== Playback controls (dislike / play / like) ===== -->
      <!-- dislike — ic_dislike (48x48 viewBox) -->
      <circle cx="80" cy="546" r="22" fill="none" :stroke="play_button_border_color" stroke-width="1.5" />
      <svg x="58" y="524" width="44" height="44" viewBox="0 0 48 48">
        <path :fill="main_theme_color"
              d="M16.9,27.1l4.2,0.5c-0.4,0.8 -0.8,2.2 -0.8,3.8c0,0.9 0.3,1.6 0.9,2c0.4,0.3 0.9,0.4 1.5,0.4h0l0,0c1,-0.1 1.3,-1 1.3,-1.7c0,-0.2 0,-0.3 0,-0.5c0.1,-0.4 0.3,-0.8 0.7,-1.7l0,0c0.3,-0.6 0.6,-0.8 1.1,-1.1c0.4,-0.2 0.9,-0.5 1.4,-1.1c0.2,-0.2 0.5,-0.6 0.7,-1c0,-0.1 0.1,-0.1 0.1,-0.2c0,0 0,0 0,0c0,0 0,0 0,-0.1c0,0 0,-0.1 0.1,-0.1c0.4,-0.4 1.1,-0.4 1.5,-0.4c0,0 0.1,0 0.1,0c0.7,0 1.1,-0.3 1.4,-0.5c0.3,-0.3 0.5,-0.8 0.5,-1.3l0,-5.9c0,-0.4 0,-0.9 -0.5,-1.3c-0.4,-0.4 -1,-0.4 -1.4,-0.4h-1.3c-0.3,0 -0.6,-0.1 -1,-0.3c-0.2,-0.1 -0.5,-0.2 -0.7,-0.3c-1.3,-0.5 -3.1,-0.7 -5.6,-0.7c-0.5,0 -2,0 -2,0c-0.5,0 -1,0.2 -1.5,0.6c-0.2,0.2 -0.4,0.5 -0.4,0.8c0,0.1 0,0.2 0,0.3c0,0.2 0,0.4 0.1,0.6c-0.4,0 -0.8,0.2 -1.1,0.5c-0.4,0.4 -0.6,0.9 -0.6,1.4c0,0.4 0.1,0.8 0.4,1.1c-0.1,0.1 -0.3,0.2 -0.4,0.3c-0.3,0.3 -0.5,0.7 -0.5,1.2c0,0.5 0.2,1 0.5,1.3c-0.4,0.4 -0.6,0.9 -0.6,1.4C15.2,26.1 15.9,27 16.9,27.1z" />
      </svg>
      <!-- play button: even ring in play_button_border_color, face = volume_bar_inactive -->
      <circle cx="187.5" cy="546" r="40" :fill="volume_bar_inactive_color"
              :stroke="play_button_border_color" stroke-width="5" />
      <!-- play glyph — ic_play (80x80 viewBox), enlarged -->
      <svg x="135.5" y="494" width="104" height="104" viewBox="0 0 80 80">
        <path :fill="main_theme_color"
              d="M53.7,39.5c0.7,-0.4 0.7,-1.3 0,-1.7L32.3,25.3c-0.7,-0.4 -1.5,0.1 -1.5,0.9l-0.1,24.4c0,0.8 0.8,1.2 1.5,0.9L53.7,39.5z" />
      </svg>
      <!-- like — ic_like (48x48 viewBox) -->
      <circle cx="295" cy="546" r="22" fill="none" :stroke="play_button_border_color" stroke-width="1.5" />
      <svg x="273" y="524" width="44" height="44" viewBox="0 0 48 48">
        <path :fill="main_theme_color"
              d="M30.7999,21.2l-4.2,-0.5c0.4,-0.8 0.8,-2.2 0.8,-3.8c0,-0.9 -0.3,-1.6 -0.9,-2c-0.4,-0.3 -0.9,-0.4 -1.5,-0.4h0l0,0c-1,0.1 -1.3,1 -1.3,1.7c0,0.2 0,0.3 0,0.5c-0.1,0.4 -0.3,0.8 -0.7,1.7l0,0c-0.3,0.6 -0.6,0.8 -1.1,1.1c-0.4,0.2 -0.9,0.5 -1.4,1.1c-0.2,0.2 -0.5,0.6 -0.7,1c0,0.1 -0.1,0.1 -0.1,0.2c0,0 0,0 0,0c0,0 0,0 0,0.1c0,0 0,0.1 -0.1,0.1c-0.4,0.4 -1.1,0.4 -1.5,0.4c0,0 -0.1,0 -0.1,0c-0.7,0 -1.1,0.3 -1.4,0.5c-0.3,0.3 -0.5,0.8 -0.5,1.3l0,5.9c0,0.4 0,0.9 0.5,1.3c0.4,0.4 1,0.4 1.4,0.4h1.3c0.3,0 0.6,0.1 1,0.3c0.2,0.1 0.5,0.2 0.7,0.3c1.3,0.5 3.1,0.7 5.6,0.7c0.5,0 2,0 2,0c0.5,0 1,-0.2 1.5,-0.6c0.2,-0.2 0.4,-0.5 0.4,-0.8c0,-0.1 0,-0.2 0,-0.3c0,-0.2 0,-0.4 -0.1,-0.6c0.4,0 0.8,-0.2 1.1,-0.5c0.4,-0.4 0.6,-0.9 0.6,-1.4c0,-0.4 -0.1,-0.8 -0.4,-1.1c0.1,-0.1 0.3,-0.2 0.4,-0.3C32.2999,27 32.3999,26.5 32.3999,26c0,-0.5 -0.2,-1 -0.5,-1.3c0.4,-0.4 0.6,-0.9 0.6,-1.4C32.5999,22.2 31.7999,21.3 30.7999,21.2z" />
      </svg>

      <!-- ===== Volume row ===== -->
      <!-- volume down — matches volumedown.png (solid speaker + minus) -->
      <svg x="16" y="606" width="24" height="24" viewBox="0 0 24 24">
        <g :fill="volume_buttons_color">
          <path d="M2 9 H6 L12 4 V20 L6 15 H2 Z" />
          <rect x="15" y="10.7" width="7" height="2.6" rx="1.3" />
        </g>
      </svg>
      <!-- track inactive -->
      <rect x="46" y="616.5" width="283" height="3" rx="1.5" :fill="volume_bar_inactive_color" />
      <!-- track active -->
      <rect x="46" y="616.5" width="160" height="3" rx="1.5" :fill="volume_bar_active_color" />
      <!-- thumb -->
      <circle cx="206" cy="618" r="7" :fill="main_theme_color" />
      <!-- volume up — matches volumeup.png (solid speaker + plus) -->
      <svg x="335" y="606" width="24" height="24" viewBox="0 0 24 24">
        <g :fill="volume_buttons_color">
          <path d="M2 9 H6 L12 4 V20 L6 15 H2 Z" />
          <rect x="15" y="10.7" width="7" height="2.6" rx="1.3" />
          <rect x="17.2" y="8.5" width="2.6" height="7" rx="1.3" />
        </g>
      </svg>

      <!-- ===== Bottom navigation (real app icons: player1/search2/historystream/timer3/info4, tinted) ===== -->
      <rect x="0" y="644" width="375" height="56" :fill="tabs_color" />
      <!-- Consistent vector icon set: every glyph built on the same r=10 circle centred at (12,12),
           rendered in an identical box so all icons are the same height and aligned. -->
      <g v-for="(tab, i) in tabs" :key="tab.id"
         :transform="`translate(${37.5 + i * 75}, 666)`">
        <g :stroke="i === 0 ? tabs_icon_selected_color : tabs_icon_color"
           :fill="i === 0 ? tabs_icon_selected_color : tabs_icon_color">
          <!-- Player: play triangle in a circle -->
          <svg v-if="tab.id === 'player'" x="-13.5" y="-19.5" width="27" height="27" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="inherit" stroke-width="1.6" />
            <path d="M9.6 7 L17 12 L9.6 17 Z" fill="none" stroke="inherit" stroke-width="1.6" stroke-linejoin="round" />
          </svg>
          <!-- Jukebox: magnifier (glass = same circle as the others, short handle) -->
          <svg v-else-if="tab.id === 'jukebox'" x="-13.5" y="-19.5" width="27" height="27" viewBox="0 0 24 24">
            <circle cx="11.4" cy="11.4" r="9.6" fill="none" stroke="inherit" stroke-width="1.6" />
            <path d="M18.2 18.2 L22.4 22.4" fill="none" stroke="inherit" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <!-- Stream: history (clock + circular arrow) -->
          <svg v-else-if="tab.id === 'stream'" x="-13.5" y="-19.5" width="27" height="27" viewBox="0 0 24 24">
            <path d="M7 3.3 A 10 10 0 1 1 3.1 7.5" fill="none" stroke="inherit" stroke-width="1.6" stroke-linecap="round" />
            <path d="M3.1 7.5 L0.6 6.4 L2.6 10.2 Z" stroke="none" />
            <path d="M12 12 V7 M12 12 L15.6 13.8" fill="none" stroke="inherit" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <!-- Timer: stopwatch -->
          <svg v-else-if="tab.id === 'timer'" x="-13.5" y="-19.5" width="27" height="27" viewBox="0 0 24 24">
            <circle cx="12" cy="13" r="9" fill="none" stroke="inherit" stroke-width="1.6" />
            <rect x="10.4" y="1.6" width="3.2" height="2.6" rx="0.7" stroke="none" />
            <path d="M12 13 V8 M12 13 L15.4 14.6" fill="none" stroke="inherit" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <!-- Info: i in a circle -->
          <svg v-else x="-13.5" y="-19.5" width="27" height="27" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="inherit" stroke-width="1.6" />
            <circle cx="12" cy="7.3" r="1.5" stroke="none" />
            <path d="M10.8 11.2 L12.2 11.2 L12.2 17" fill="none" stroke="inherit" stroke-width="1.7"
                  stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </g>
        <text x="0" y="21" text-anchor="middle" font-size="11.5"
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
