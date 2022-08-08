<template>
  <div>
    <el-tag
      v-if="row['loai_phe_duyet'] === 2"
      effect="plain"
      type="primary"
      disable-transitions
      v-text="'Phê duyệt và PC HS tự động'"
    />
    <el-tag
      v-else-if="row['loai_phe_duyet'] === 3"
      effect="plain"
      type="warning"
      disable-transitions
      v-text="'Phê duyệt và PC chuyên viên XLHS'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'TrangThaiPhanCongHoSoKiemDinh',
  props: {
    row: Object,
    column: Object
  }
}
</script>
