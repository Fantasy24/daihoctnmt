<template>
  <div>
    <el-tag
      v-if="row['trang_thai'] === 1"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Chờ phê duyệt'"
    />
    <el-tag
      v-if="row['trang_thai'] === 2"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Phê duyệt'"
    />
    <el-tag
      v-if="row['trang_thai'] === 3"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối phê duyệt'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TinhTrangRecord',
  props: {
    row: Object,
    column: Object
  }
}
</script>
