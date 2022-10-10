<template>
  <SignUpTemplate />
</template>

<script>
import { cacheLocal } from "@/utils/ECustomsUtils";
import SignUpTemplate from "ff24-customs-lib/src/lib-components/login-ent/signup";

export default {
  name: "SignUp",
  components: { SignUpTemplate },
  props: {
    loadCacheLocal: {
      type: Function,
      default: cacheLocal,
    },
  },
  mounted() {
    // console.log(this.$store);
    // console.log(this.$store.state);
    console.log("SignUp test");
  },
};
</script>