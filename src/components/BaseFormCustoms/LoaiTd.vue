<template>
  <div>
    <el-tag
      v-if="row['loaiTd'] === 1"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaitdText'] || 'Container rút hàng'"
    />
    <el-tag
      v-if="row['loaiTd'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['loaitdText'] || 'Đóng hàng vào container'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'LoaiTd',
  props: {
    row: Object,
    column: Object
  }
}
</script>
