<template>
  <div>
    <el-tag
      v-if="row['noi_nhan'] === 1"
      effect="plain"
      type="success"
      disable-transitions
      v-text="'Trong ngành'"
    />
    <el-tag
      v-else-if="row['noi_nhan'] === 2"
      effect="plain"
      type="info"
      disable-transitions
      v-text="'Ngoài ngành'"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'NoiNhan',
  props: {
    row: Object,
    column: Object
  }
}
</script>
