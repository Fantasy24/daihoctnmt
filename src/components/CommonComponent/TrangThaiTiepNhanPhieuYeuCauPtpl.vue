<template>
  <div>
    <el-tag
      v-if="row['ma_trang_thai'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Mới'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Chờ tiếp nhận'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 3"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Yêu cầu bổ sung HS'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 4"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối tiếp nhận HS'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 5"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Tiếp nhận'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 8"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối phê duyệt HS'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 9"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Đã phê duyệt HS'"
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
