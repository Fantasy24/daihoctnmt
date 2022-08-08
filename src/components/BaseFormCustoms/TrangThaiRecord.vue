<template>
  <div>
    <el-tag
      v-if="row['status'] === '1'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Kích hoạt'"
    />
    <el-tag
      v-if="row['status'] === '0'"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Hủy kích hoạt'"
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
