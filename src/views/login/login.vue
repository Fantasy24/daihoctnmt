<template>
  <LoginTemplate :after-login-cb="loadCacheLocal" />
</template>

<script>
import { cacheLocal } from "@/utils/ECustomsUtils";
import LoginTemplate from "ff24-customs-lib/src/lib-components/login/login";

export default {
  name: "Login",
  components: { LoginTemplate },
  props: {
    loadCacheLocal: {
      type: Function,
      default: cacheLocal,
    },
  },
  mounted() {
    console.log(this.$store);
    console.log(this.$store.state);
    console.log(this.$store.state.app.sidebar);
  },
};
</script>