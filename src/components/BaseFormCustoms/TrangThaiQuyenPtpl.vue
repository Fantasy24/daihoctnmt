<template>
  <div>
    <el-tag
      v-if="row['loai_hanh_dong'] === 0"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Không có quyền'"
    />
    <el-tag
      v-if="row['loai_hanh_dong'] === 1"
      effect="plain"
      type=""
      disable-transitions
      v-text="'Phân tích'"
    />
    <el-tag
      v-if="row['loai_hanh_dong'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Phân loại'"
    />
    <el-tag
      v-if="row['loai_hanh_dong'] === 3"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Phân tích phân loại'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiQuyenPtpl',
  props: {
    row: Object,
    column: Object
  }
}
</script>
