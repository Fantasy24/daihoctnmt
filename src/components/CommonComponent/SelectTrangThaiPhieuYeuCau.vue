<template>
  <el-form-item :prop="prop">
    <span
      slot="label"
    >{{ label }}<output v-if="required" style="color: red">*</output></span>
    <el-select
      v-model="selectedValue"
      placeholder="Chọn trạng thái"
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
  name: 'SelectTrangThaiPhieuYeuCau',
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
      default: 'Trạng thái'
    },
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lstStatus: [
        { key: null, label: 'Tất cả' },
        { key: 1, label: 'Mới' },
        { key: 2, label: 'Chờ tiếp nhận' },
        { key: 3, label: 'Yêu cầu bổ sung hồ sơ' },
        { key: 4, label: 'Đã tiếp nhận chờ phê duyệt' },
        { key: 5, label: 'Không duyệt yêu cầu' },
        { key: 6, label: 'Đã duyệt yêu cầu' }
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

<style scoped></style>
