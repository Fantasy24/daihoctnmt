<template>
  <div id="app">
    <!-- <img alt="Tnmt logo" src="./assets/images/logo.png"> -->
    <!-- <modal-idle /> -->
    <router-view />
  </div>
</template>

<script>
// import ModalIdle from 'ff24-customs-lib/src/IdleModal'
import AppResize from 'ff24-layout/src/base-mixin/AppResize'

export default {
  name: 'App',
  components: {
    // ModalIdle
  },
  mixins: [AppResize]
}
</script>
