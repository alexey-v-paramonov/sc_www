<template>
<div>
  <Header />
  <div>
    !{{ $t('welcome') }}!
    </div>
</div>
</template>

<script>
import Header from '~/components/Header.vue'

export default {
  components: {
    Header
  },
  data() {
    return {}
  }
}
</script>