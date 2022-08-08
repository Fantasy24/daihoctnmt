<template>
  <div>
    <el-tag
      v-if="row['ma_trang_thai'] === 1"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['trangThaiText'] || 'Đã cập nhật kết quả'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 2"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['trangThaiText'] || 'Chờ phê duyệt'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 3"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['trangThaiText'] || 'Đã phê duyệt'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 4"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['trangThaiText'] || 'Yêu cầu sửa lại'"
    />
    <el-tag
      v-if="row['ma_trang_thai'] === 5"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="row['trangThaiText'] || 'Không duyệt'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiKetQuaTaiGiamDinh',
  props: {
    row: Object,
    column: Object
  }
}
</script>
