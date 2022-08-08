<template>
  <div>
    <el-tag
      v-if="row['syncSv'] === 0"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['syncSvText'] || 'Mở tờ khai'"
    />

    <el-tag
      v-if="row['syncSv'] === 1"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['syncSvText'] || 'Đủ điều kiện'"
    />

    <el-tag
      v-if="row['syncSv'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['syncSvText'] || 'Hủy trong thông quan'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    row: Object,
    column: Object
  }
}
</script>
