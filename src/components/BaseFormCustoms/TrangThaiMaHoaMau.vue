<template>
  <div>
    <el-tag
      v-if="row['loai_ma_hoa_mau'] === 0"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Chờ nhập tiêu chí phân tích'"
    />
    <el-tag
      v-if="row['loai_ma_hoa_mau'] === 1"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Chờ mã hóa mẫu'"
    />
    <el-tag
      v-if="row['loai_ma_hoa_mau'] === 2"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Mã hóa mẫu'"
    />
    <el-tag
      v-if="row['loai_ma_hoa_mau'] === 3"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Gửi giám định bên ngoài'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiMaHoaMau',
  props: {
    row: Object,
    column: Object
  }
}
</script>
