<template>
  <div>
    <el-tag
      v-if="row['loai'] === 1"
      effect="plain"
      type="primary"
      disable-transitions
    >
      Nhập
    </el-tag>
    <el-tag
      v-if="row['loai'] === 2"
      effect="plain"
      type="warning"
      disable-transitions
    >
      Xuất
    </el-tag>
    <el-tag
      v-if="row['loai'] === 3"
      effect="plain"
      type="success"
      disable-transitions
    >
      Nội địa
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
