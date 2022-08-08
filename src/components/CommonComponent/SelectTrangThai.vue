<template>
  <div :id="idContainer">
    <el-form-item
      :prop="propForm"
      :rules="required ? rules : null"
      :required="required"
      :label="showLabel ? label : ''"
      :label-width="labelWidth"
    >
      <el-select
        v-model="valueSync"
        :popper-class="popperClass"
        clearable
        filterable
        :placeholder="placeholder"
        style="width: 100%"
        :disabled="disabled"
        :loading="loading"
        @change="onChange"
      >
        <el-option v-if="isShowOptionAll" :label="labelOption" :value="''" />
        <el-option
          v-for="item in listData"
          :key="item.key"
          :title="item.label"
          :label="`${item.label || ''}`"
          :value="item.key"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    vModel: {
      type: String,
      default: ""
    },
    idContainer: {
      type: String,
      default: 'idSelectYesNo'
    },
    popperClass: {
      type: String,
      default: 'idSelectYesNo'
    },
    label: {
      type: String,
      default: 'Trạng thái'
    },
    isShowOptionAll: {
      type: Boolean,
      default: true
    },
    labelOption: {
      type: String,
      default: 'Tất cả'
    },
    placeholder: {
      type: String,
      default: 'Chọn giá trị'
    },
    required: {
      type: Boolean,
      default: false
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
        return [{ required: true, message: 'Trạng thái bắt buộc nhập' }]
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
      loading: false,
      listData: [
        { key: "1", label: 'Kích hoạt' },
        { key: "0", label: 'Hủy kích hoạt' }
      ]
    }
  },
  computed: {
    valueSync: {
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
      this.getList(this.listData)
    }
  },
  methods: {
    onChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped></style>
