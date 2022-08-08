<template>
  <div>
    <el-tag
      v-if="row['trangThai'] === 11"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['trangThaiText'] || 'Chờ duyệt'"
    />
    <el-tag
      v-if="row['trangThai'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['trangThaiText'] || 'Từ chối'"
    />
    <el-tag
      v-if="row['trangThai'] === 12"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['trangThaiText'] || 'Đã duyệt'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiPheDuyet',
  props: {
    row: Object,
    column: Object
  }
}
</script>
