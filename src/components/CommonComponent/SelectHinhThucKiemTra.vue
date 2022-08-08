<template>
  <el-form-item
    :prop="propForm"
    :rules="required ? rules : null"
    :required="required"
    :label="showLabel ? label : ''"
    :label-width="labelWidth"
  >
    <el-select
      v-model="selectedValue"
      placeholder="Chọn hình thức kiểm tra"
      style="width: 100%;"
      clearable
      :disabled="disabled"
      @clear="onClear"
    >
      <el-option
        v-for="type in lstStatus"
        :key="type.key"
        :value="type.key"
        :label="type.label"
      />
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'SelectHinhThucKiemTra',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    vModel: {
      default: ''
    },
    label: {
      type: String,
      default: 'Hình thức kiểm tra'
    },
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    rules: {
      type: Array,
      default: () => {
        return [{ required: true, message: 'Hình thức kiểm tra bắt buộc nhập' }]
      }
    },
    propForm: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    getList: Function
  },
  data() {
    return {
      lstStatus: [
        { key: 1, label: 'Miễn kiểm tra' },
        { key: 2, label: 'Kiểm tra tỷ lệ' },
        { key: 3, label: 'Kiểm tra toàn bộ' }
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
  mounted() {
    if (this.getList !== undefined && this.getList !== null) {
      this.getList(this.lstStatus)
    }
  },
  methods: {
    onClear() {
      this.$emit('update:vModel', null)
    }
  }
}
</script>

<style scoped></style>
