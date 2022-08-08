<template>
  <div>
    <el-tag
      v-if="row['status'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Còn hiệu lực'"
    />
    <el-tag
      v-if="row['status'] === 0"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Hết hiệu lực'"
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
