<template>
  <div>
    <el-tag
      v-if="loaiXnk === 1 && loaiOut === 1"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="hkLoaiNhapText || 'NKVK1 - Nhập khẩu'"
    />
    <el-tag
      v-if="loaiXnk === 1 && loaiOut === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="hkLoaiNhapText || 'NKVK2 - Vận chuyển sang địa điểm GS khác'"
    />

    <el-tag
      v-if="loaiXnk === 2 && loaiOut === 1"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="hkLoaiXuatText || 'XKVK1 - Xuất khẩu'"
    />
    <el-tag
      v-if="loaiXnk === 2 && loaiOut === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="hkLoaiXuatText || 'XKVK2 - Vận chuyển sang địa điểm GS khác'"
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
    loaiXnk() {
      return this.row['loai'] || 0
    },
    loaiOut() {
      return this.row['loaiOut'] || this.row['loaiIn'] || 0
    },
    hkLoaiNhapText() {
      return this.row['hkLoaiNhapText'] || ''
    },
    hkLoaiXuatText() {
      return this.row['hkLoaiXuatText'] || ''
    }
  }
}
</script>
