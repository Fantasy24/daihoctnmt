<template>
  <div>
    <el-tag
      v-if="row['trangThai'] === 0"
      effect="plain"
      type="warning"
      disable-transitions
    >
      Chưa soi chiếu
    </el-tag>
    <el-tag
      v-if="row['trangThai'] === 1"
      effect="plain"
      type="success"
      disable-transitions
    >
      Đã soi chiếu
    </el-tag>
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
