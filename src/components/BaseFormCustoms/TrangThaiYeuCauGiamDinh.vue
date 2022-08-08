<template>
  <div>
    <el-tag
      v-if="row['ma_trang_thai'] === 1"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Tạo mới'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 2"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Chờ phê duyệt'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 3"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Yêu cầu sửa lại'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 4"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối phê duyệt'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 5"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Đã phê duyệt'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 6"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Đã gửi giám định'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiYeuCauGiamDinh',
  props: {
    row: Object,
    column: Object
  }
}
</script>
