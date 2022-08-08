<template>
<div>
  <Header />
  <div>
    !{{ $t('welcome') }}!
  </div>
  <Signup />
</div>
</template>

<script>
import Header from '~/components/Header.vue'
import Signup from '~/components/Signup.vue'

export default {
  components: {
    Header, Signup
  },
  data() {
    return {}
  }
}
</script>