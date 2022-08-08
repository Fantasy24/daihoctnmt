<template>
  <div>
    <el-tag
      v-if="row['ttKhoa'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['ttKhoa'] || 'Có'"
    />
    <el-tag
      v-if="row['ttKhoa'] === 0"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['ttKhoa'] || 'Không'"
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
