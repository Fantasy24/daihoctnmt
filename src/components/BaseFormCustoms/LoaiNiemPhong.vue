<template>
  <div>
    <el-tag
      v-if="row['loaiNp'] === 1"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiNpText']"
    />
    <el-tag
      v-if="row['loaiNp'] === 2"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiNpText']"
    />
    <el-tag
      v-if="row['loaiNp'] === 3"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiNpText']"
    />
    <el-tag
      v-if="row['loaiNp'] === 4"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiNpText']"
    />
    <el-tag
      v-if="row['loaiNp'] === 9"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiNpText']"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'LoaiTd',
  props: {
    row: Object,
    column: Object
  }
}
</script>
