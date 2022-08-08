<template>
  <div>
    <el-tag
      v-if="row['luong'] === '1'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['luongText'] || 'Xanh'"
    />
    <el-tag
      v-if="row['luong'] === '2'"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['luongText'] || 'Vàng'"
    />
    <el-tag
      v-if="row['luong'] === '3'"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="row['luongText'] || 'Đỏ'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'LuongGrid',
  props: {
    row: Object,
    column: Object
  }
}
</script>
