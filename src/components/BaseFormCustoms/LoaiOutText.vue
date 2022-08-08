<template>
  <div>
    <el-tag
      effect="plain"
      type="primary"
      disable-transitions
      v-text="loaiOutText"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    row: Object,
    column: Object
  },
  computed: {
    loaiOut() {
      return this.row['loaiOut'] || 0
    },
    loaiOutText() {
      return this.row['loaiOutText'] || ''
    }
  }
}
</script>
