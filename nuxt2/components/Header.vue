<template>
  <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
      <h5 class="my-0 mr-md-auto font-weight-normal">Streaming.center</h5>
      <nav class="my-2 my-md-0 mr-md-3">
        <a class="p-2 text-dark" href="/">Home</a>
        <a class="p-2 text-dark" href="#">Pricing</a>
        <a class="p-2 text-dark" href="#">Info</a>
        <a class="p-2 text-dark" href="#">Radio Catalog</a>
      </nav>
      <a class="btn btn-outline-primary" href="#">{{ $t('signin') }}</a>
      <div @click="changeLanguage('en')"><span class="flag-icon flag-icon-us"></span> ENG</div> /
      <div @click="changeLanguage('ru')"><span class="flag-icon flag-icon-ru"></span> RUS</div>

  </div>
</template>

<script>
export default {
  methods: {
    changeLanguage(lang) {
      console.log("LANG: ", lang)
      this.$i18n.locale = lang;
    }
  }
};
</script>