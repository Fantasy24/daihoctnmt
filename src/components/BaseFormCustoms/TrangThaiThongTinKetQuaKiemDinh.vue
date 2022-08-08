<template>
  <div>
    <el-tag
      v-if="row['ma_trang_thai'] === 3"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối'"
    />
    <el-tag
      v-else-if="row['ma_trang_thai'] === 2"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Phê duyệt'"
    />
    <el-tag
      v-else-if="row['ma_trang_thai'] === 1"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Chờ phê duyệt'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiThongTinKetQuaKiemDinh',
  props: {
    row: Object,
    column: Object
  }
}
</script>
