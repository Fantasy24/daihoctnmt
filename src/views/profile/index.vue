<template>
  <profile
    :router="$router"
    :store="$store"
    :user-info="userInfo"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import Profile from 'ff24-customs-lib/src/lib-components/profile/Profile'

export default {
  name: 'ProfileInfo',
  components: {
    Profile
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>
