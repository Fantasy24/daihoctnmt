<template>
  <div>
    <el-tag
      v-if="row['status'] === '1'"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Sẵn sàng SD'"
    />
    <el-tag
      v-if="row['status'] === '0'"
      effect="plain"
      type="danger"
      disable-transitions
      v-text="'Hỏng'"
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
