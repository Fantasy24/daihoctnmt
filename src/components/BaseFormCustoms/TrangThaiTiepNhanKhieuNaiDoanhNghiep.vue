<template>
  <div>
    <el-tag
      v-if="row['phuong_an_giai_quyet'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['phuongAnText'] || 'Tách mẫu tái giám định'"
    />
    <el-tag
      v-if="row['phuong_an_giai_quyet'] === 2"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="row['phuongAnText'] || 'Từ chối giải quyết khiếu nại'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiTiepNhanKhieuNaiDoanhNghiep',
  props: {
    row: Object,
    column: Object
  }
}
</script>
