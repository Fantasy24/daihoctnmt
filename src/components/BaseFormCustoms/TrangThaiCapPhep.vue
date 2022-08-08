<template>
  <div>
    <el-tag
      v-if="row['trangThaiTq'].trim() === 'TQ'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['trangThaiTqText'] || 'Thông quan'"
    />

    <el-tag
      v-if="row['trangThaiTq'].trim() === 'MHBQ'"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['trangThaiTqText'] || 'Đưa hàng bảo quản'"
    />

    <el-tag
      v-if="row['trangThaiTq'].trim() === 'GPH'"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['trangThaiTqText'] || 'Giải phòng hàng'"
    />

    <el-tag
      v-if="row['trangThaiTq'].trim() === 'CCK'"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['trangThaiTqText'] || 'Chuyển địa điểm kiểm tra'"
    />

    <el-tag
      v-if="row['trangThaiTq'].trim() === 'KHH'"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['trangThaiTqText'] || 'Chờ thông quan sau khi kiểm hóa hộ'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    row: Object,
    column: Object
  }
}
</script>
