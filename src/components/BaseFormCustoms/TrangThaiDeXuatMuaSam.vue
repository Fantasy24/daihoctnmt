<template>
  <div>
    <el-tag
      v-if="row['status'] === '1'"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Đề xuất'"
    />
    <el-tag
      v-if="row['status'] === '2'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Phê duyệt đề xuất'"
    />
    <el-tag
      v-if="row['status'] === '3'"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Từ chối đề xuất'"
    />
    <el-tag
      v-if="row['status'] === '0'"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Xóa đề xuất'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: "TinhTrangRecord",
  props: {
    row: Object,
    column: Object,
  },
};
</script>
