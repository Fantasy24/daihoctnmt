<template>
  <div>
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 5"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Chờ phê duyệt'"
    />
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 6"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Phê duyệt'"
    />
    <el-tag
      v-if="row['trang_thai_phe_duyet'] === 8"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối'"
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
