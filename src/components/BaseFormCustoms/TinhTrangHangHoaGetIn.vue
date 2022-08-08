<template>
  <div>
    <el-tag
      v-if="row['isfinal'] === 0"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="row['isfinalText'] || 'Chưa getin hết số lượng'"
    />
    <el-tag
      v-if="row['isfinal'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="row['isfinalText'] || 'Đã getin hết số lượng'"
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
