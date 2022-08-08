<template>
  <div>
    <el-tag
      v-if="row['ma_trang_thai'] === 1"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Mới'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 2"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Đã thi hành xong'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiBienBanToaAn',
  props: {
    row: Object,
    column: Object
  }
}
</script>
