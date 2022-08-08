<template>
  <el-form-item
    :prop="prop"
  >
    <span slot="label">{{ label }}<output v-if="required" style="color: red">*</output></span>
    <el-select
      v-model="selectedValue"
      placeholder="Chọn tình trạng hàng hóa"
      style="width: 100%;"
      clearable
      @clear="onClear"
    >
      <el-option
        v-for="type in goodsStatus"
        :key="type.key"
        :value="type.key"
        :label="type.label"
      />
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'SelectTinhTrangHangHoa',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    vModel: {
      default: ''
    },
    prop: {
      type: String,
      default: 'status'
    },
    label: {
      type: String,
      default: 'Tình trạng hàng hóa '
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      goodsStatus: [
        { key: null, label: 'Tất cả' },
        { key: 1, label: 'Có hàng hóa' },
        { key: 0, label: 'Rỗng' }
      ]
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.vModel
      },
      set(val) {
        this.$emit('update:vModel', val)
      }
    }
  },
  methods: {
    onClear() {
      this.$emit('update:vModel', null)
    }
  }
}
</script>

<style scoped>

</style>
