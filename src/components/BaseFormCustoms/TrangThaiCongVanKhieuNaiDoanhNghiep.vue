<template>
  <div>
    <el-tag
      v-if="row['ma_trang_thai'] === 1"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['trangThaiText'] || 'Chưa xử lý'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 2"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['trangThaiText'] || 'Đã chuyển xử lý'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiCongVanKhieuNaiDoanhNghiep',
  props: {
    row: Object,
    column: Object
  }
}
</script>
