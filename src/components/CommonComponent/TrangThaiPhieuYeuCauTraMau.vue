<template>
  <div>
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Mới'"
    />
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Chờ phê duyệt'"
    />
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 3"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Đã phê duyệt'"
    />
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 4"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối phê duyệt'"
    />
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 5"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Đã trả mẫu'"
    />
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 6"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Yêu cầu sửa lại'"
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
