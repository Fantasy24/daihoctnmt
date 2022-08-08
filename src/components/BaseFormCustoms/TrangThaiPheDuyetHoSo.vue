<template>
  <div>
    <el-tag
      v-if="row['status_pyc'] === 8"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối phê duyệt'"
    />
    <el-tag
      v-else-if="row['status_pyc'] === 9"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Đã phê duyệt'"
    />
    <el-tag
      v-else-if="row['status_pyc'] === 5"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Chờ phê duyệt'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiPheDuyetHoSo',
  props: {
    row: Object,
    column: Object
  }
}
</script>
