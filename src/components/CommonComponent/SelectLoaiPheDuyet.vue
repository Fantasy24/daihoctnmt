<template>
  <el-form-item :prop="prop">
    <span
      slot="label"
    >{{ label }}<output v-if="required" style="color: red">*</output></span>
    <el-select
      v-model="selectedValue"
      placeholder="Chọn loại phê duyệt"
      style="width: 100%;"
      clearable
      :disabled="disabled"
      @change="onChange"
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
  name: 'SelectLoaiPheDuyet',
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
      default: 'Loại phê duyệt'
    },
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    getList: Function
  },
  data() {
    return {
      lstStatus: [
        { key: 1, label: 'Từ chối phê duyệt' },
        { key: 2, label: 'Phê duyệt và PCHS tự động' },
        { key: 3, label: 'Phê duyệt và PC chuyên viên XLHS' }
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
    },
    onChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped></style>
