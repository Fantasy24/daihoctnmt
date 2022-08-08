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
      placeholder="Chọn loại mẫu trả"
      style="width: 100%;"
      clearable
      :disabled="disabled"
      @clear="onClear"
      @change="onChange"
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
  name: 'SelectLoaiTraMau',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    vModel: {
      default: ''
    },
    label: {
      type: String,
      default: 'Loại mẫu trả'
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
        return [{ required: true, message: 'Loại mẫu trả bắt buộc nhập' }]
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
        { key: 1, label: 'Trả mẫu sau khi đã phân tích phân loại' },
        {
          key: 2,
          label: 'Trả mẫu không phân tích phân loại sau khi đã tiếp nhận'
        }
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
    getListData() {
      return this.lstStatus
    },
    onClear() {
      this.$emit('update:vModel', null)
    },
    onChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped></style>
