<template>
  <div>
    <el-tag
      v-if="row['status'] === '1'"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="'Đăng ký mới'"
    />
    <el-tag
      v-else-if="row['status'] === '2'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Phê duyệt'"
    />
    <el-tag
      v-else-if="row['status'] === '3'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Hoàn thành'"
    />
    <el-tag
      v-else-if="row['status'] === '4'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Từ chối'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: "TrangThaiPheDuyetHoSo",
  props: {
    row: Object,
    column: Object,
  },
};
</script>
