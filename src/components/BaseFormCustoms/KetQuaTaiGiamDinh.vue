<template>
  <div>
    <el-tag
      v-if="row['ket_luan_kq_tgd'] === 1"
      disable-transitions
      v-text="row['ket_luan_kq_tgd_text'] || 'Còn mẫu'"
    />
    <el-tag
      v-if="row['ket_luan_kq_tgd'] === 2"
      disable-transitions
      v-text="row['ket_luan_kq_tgd_text'] || 'Không còn mẫu'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'KetQuaTaiGiamDinh',
  props: {
    row: Object,
    column: Object
  }
}
</script>
