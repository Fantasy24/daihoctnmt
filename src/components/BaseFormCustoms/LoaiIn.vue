<template>
  <div>
    <el-tag
      v-if="row['loaiIn'] === 1"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiInText'] || 'Từ nước ngoài đưa vào kho'"
    />
    <el-tag
      v-if="row['loaiIn'] === 2"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiInText'] || 'Từ nội địa đưa vào kho'"
    />
    <el-tag
      v-if="row['loaiIn'] === 3"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="row['loaiInText'] || 'Từ KNQ khác'"
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
