<template>
  <div>
    <el-tag
      v-if="row['ttHangHoa'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['ttHangHoaText'] || 'Có hàng hóa'"
    />
    <el-tag
      v-if="row['ttHangHoa'] === 0"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['ttHangHoaText'] || 'Rỗng'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TinhTrangHangHoa',
  props: {
    row: Object,
    column: Object
  }
}
</script>
