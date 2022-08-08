<template>
  <login-template />
</template>

<script>
import LoginTemplate from 'ff24-customs-lib/src/lib-components/login/login'

export default {
  name: 'Login',
  components: { LoginTemplate },
  mounted() {
    console.log(this.$store)
    console.log(this.$store.state)
    console.log(this.$store.state.app.sidebar)
  }
}
</script>
