<template>
  <div>
    <el-tag
      v-if="row['loai'] === 1"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiContText'] || 'Nhập'"
    />
    <el-tag
      v-if="row['loai'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['loaiContText'] || 'Xuất'"
    />
    <el-tag
      v-if="row['loai'] === 3"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['loaiContText'] || 'Nội địa'"
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
